import { Schema, model, Types } from 'mongoose';
import { TPayment } from './payment.interface';

const PaymentSchema = new Schema<TPayment>(
  {
    tran_id: { type: String, required: true, unique: true },
    orderNo: { type: String, required: true, unique: true }, // Add orderNo field
    email: { type: String, required: true },
    orderInfo: [
      {
        productId: {
          type: Types.ObjectId,
          required: true,
          ref: 'CustomizableMeal',
        },
        orderedQuantity: { type: Number, required: true },
        _id: { type: Types.ObjectId, required: false }, // Make _id optional or handle as per requirement
      },
    ],
    totalPrice: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Unpaid'],
      required: true,
      default: 'Unpaid',
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Canceled'],
      required: true,
      default: 'Pending',
    },
    customerInfo: {
      name: { type: String, required: true },
      number: { type: String, required: true },
      city: { type: String, required: true },
      clolony: { type: String, required: true },
      postOffice: { type: String, required: true },
      subDistrict: { type: String, required: true },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

export const PaymentModel = model<TPayment>('Payment', PaymentSchema);
