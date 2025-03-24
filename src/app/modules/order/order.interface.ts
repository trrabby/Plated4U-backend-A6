import { Types } from 'mongoose';

export type TOrder = {
  email: string;
  orderInfo: [
    {
      name: string;
      description: string;
      imgUrl: string[];
      productId: Types.ObjectId;
      baseOptions: string;
      proteinOptions: string;
      extras: string[];
      dietaryPreferences: string;
      price: number;
      orderedQuantity: number;
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
