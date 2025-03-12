/* eslint-disable @typescript-eslint/no-explicit-any */

import QueryBuilder from '../../builder/QueryBuilder';
import config from '../../config';
import sslcz from '../../utils/SSLConfig';
import { OrderModel } from '../order/order.model';
import { PaymentModel } from './payment.model';
import mongoose from 'mongoose';

const generateTranId = (): string => {
  return `REF${Date.now()}${Math.floor(Math.random() * 100000)}`;
};

// Initialize Payment
export const initializePayment = async (data: any) => {
  const orderNo = data.orderData._id;
  const tran_id: string = generateTranId();
  data.tran_id = tran_id;
  data.success_url = `${config.url}/payments/success/${orderNo}?tran_id=${tran_id}`;
  data.fail_url = `${config.url}/payments/fail/${orderNo}`;
  data.cancel_url = `${config.url}/payments/cancel`;
  data.ipn_url = `${config.url}/payments/ipin`;

  const apiResponse = await sslcz.init(data);
  return apiResponse.GatewayPageURL;
};

// Process Payment Success
export const processPaymentSuccess = async (
  orderData: any,
  tran_id: string,
) => {
  const orderNo = orderData.id;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update the order with paymentStatus and orderStatus
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { _id: orderNo },
      { paymentStatus: 'Paid', orderStatus: 'Confirmed' },
      { new: true, session }, // Ensure transaction is applied
    );

    if (!updatedOrder) {
      throw new Error('Order not found');
    }

    // Create a new Payment document using updated order data
    const transactionData = {
      ...updatedOrder.toObject(), // Convert to plain object to avoid Mongoose document issues
      orderNo,
      tran_id,
    } as any;
    delete transactionData._id;
    delete transactionData.createdAt;
    delete transactionData.updatedAt;

    await PaymentModel.create([transactionData], { session });
    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return `${config.frontend_url}/paymentSuccess/${orderNo}?trans_id=${tran_id}`;
  } catch (error) {
    // Rollback in case of error
    await session.abortTransaction();
    session.endSession();
    throw error; // Re-throw the error for handling
  }
};
// Process Payment Success
export const processPaymentFailed = async (orderData: any) => {
  const orderNo = orderData.id;
  // Update the order with paymentStatus and orderStatus
  const updatedOrder = await OrderModel.findOneAndUpdate(
    { _id: orderNo },
    { paymentStatus: 'Failed' },
    { new: true }, // Ensure transaction is applied
  );

  if (!updatedOrder) {
    throw new Error('Order not found');
  }
  return `${config.frontend_url}/paymentFailed?order_no=${orderNo}`;
};

const paymentSearchableFields = [
  'orderNo',
  'tran_id',
  'paymentStatus',
  'orderStatus',
];

const getAllPaymentData = async (query: Record<string, unknown>) => {
  const paymentQuery = new QueryBuilder(PaymentModel.find(), query)
    .search(paymentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await paymentQuery.modelQuery
    .sort({ _id: -1 })
    .populate({
      path: 'orderInfo.productId', // The field to populate
      select: 'brand model year price imgUrl', // Fields to select from the populated document
    })
    .select('-__v'); // Optionally exclude fields from the main document (e.g., exclude `__v`)

  const meta = await paymentQuery.countTotal();

  return { meta, result };
};

const getAPaymentData = async (tran_id: string) => {
  const result = await PaymentModel.find({ tran_id }).populate({
    path: 'orderInfo.productId', // The field to populate
    select: 'brand model year price imgUrl', // Fields to select from the populated document
  });
  return result;
};

const getMyPaymentsData = async (
  query: Record<string, unknown>,
  email: string,
) => {
  const paymentQuery = new QueryBuilder(PaymentModel.find({ email }), query)
    .search(paymentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await paymentQuery.modelQuery
    .sort({ _id: -1 })
    .populate({
      path: 'orderInfo.productId', // The field to populate
    })
    .select('-__v'); // Optionally exclude fields from the main document (e.g., exclude `__v`)

  const meta = await paymentQuery.countTotal();

  return { meta, result };
};

export const paymentService = {
  initializePayment,
  processPaymentSuccess,
  processPaymentFailed,
  getAllPaymentData,
  getAPaymentData,
  getMyPaymentsData,
};
