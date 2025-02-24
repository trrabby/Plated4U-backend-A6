import { paymentService } from './payment.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import customizedMsg from '../../utils/customisedMsg';

// Initialize Payment
export const initPayment = catchAsync(async (req, res) => {
  const paymentUrl = await paymentService.initializePayment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment initialization successful',
    data: { paymentUrl },
  });
});

// Handle Payment Success
export const paymentSuccess = catchAsync(async (req, res) => {
  const { tran_id } = req.query;
  const redirectUrl = await paymentService.processPaymentSuccess(
    req.params,
    tran_id as string,
  );
  // console.log(redirectUrl);
  return res.redirect(redirectUrl); // Redirect without sending JSON response
});

// Handle Payment Fail
export const paymentFailed = catchAsync(async (req, res) => {
  const redirectUrl = await paymentService.processPaymentFailed(req.params);
  // console.log(redirectUrl);
  return res.redirect(redirectUrl); // Redirect without sending JSON response
});

const getAllpaymentsFun = catchAsync(async (req, res) => {
  const result = await paymentService.getAllPaymentData(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: customizedMsg(result?.result, 'Payments'),
    data: result,
  });
});

const getAPaymentFun = catchAsync(async (req, res) => {
  const { tran_id } = req.params;
  const result = await paymentService.getAPaymentData(tran_id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transaction retrieved successfully',
    data: result,
  });
});

export const PaymentModel = {
  initPayment,
  paymentSuccess,
  getAllpaymentsFun,
  getAPaymentFun,
};
