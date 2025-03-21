import { Types } from 'mongoose';

export type TOrder = {
  email: string;
  orderInfo: [
    {
      productId: Types.ObjectId;
      base: string;
      protein: string;
      extras: string[];
      orderedQuantity: number;
      price: number;
    },
  ];
  totalPrice: number;
  paymentStatus: string;
  orderStatus: string;
  customerInfo: {
    name: string;
    number: string;
    city: string;
    colony: string;
    postOffice: string;
    subDistrict: string;
  };
};
