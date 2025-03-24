import { Schema, model, Types } from 'mongoose';
import { TOrder } from './order.interface';

const OrderSchema = new Schema<TOrder>(
  {
    email: { type: String, required: true },
    orderInfo: [
      {
        productId: {
          type: Types.ObjectId,
          required: true,
          ref: 'CustomizableMeal',
        },
        name: { type: String, required: true },
        description: { type: String, required: true },
        imgUrl: [{ type: String, required: true }],
        baseOptions: { type: String, required: true },
        proteinOptions: { type: String, required: true },
        dietaryPreferences: { type: String, required: true },
        extras: [{ type: String, required: true }],
        orderedQuantity: { type: Number, required: true },
        price: { type: Number, required: true },
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
      colony: { type: String, required: true },
      postOffice: { type: String, required: true },
      subDistrict: { type: String, required: true },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

export const OrderModel = model<TOrder>('Order', OrderSchema);
