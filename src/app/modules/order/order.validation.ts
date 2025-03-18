import { z } from 'zod';

export const orderValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address.'),
    orderInfo: z.array(
      z.object({
        productId: z.string().min(1, 'Product ID is required.'),
        orderedQuantity: z
          .number()
          .positive('Product quantity must be greater than 0.'),
      }),
    ),
    totalPrice: z.number().positive('Total price must be greater than 0.'),
    customerInfo: z.object({
      name: z.string().min(1, 'Name is required.'),
      number: z.string().min(1, 'Number is required.'),
      city: z.string().min(1, 'City is required.'),
      colony: z.string().min(1, 'Colony is required.'),
      postOffice: z.string().min(1, 'Post office is required.'),
      subDistrict: z.string().min(1, 'Sub-district is required.'),
    }),
  }),
});

export const updateOrderValidationSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  orderInfo: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        orderedQuantity: z.number().min(1, 'Quantity must be at least 1'),
      }),
    )
    .optional(),
  totalPrice: z.number().min(0, 'Total price cannot be negative').optional(),
  paymentStatus: z.enum(['Pending', 'Paid', 'Failed', 'Unpaid']).optional(),
  orderStatus: z
    .enum(['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Canceled'])
    .optional(),
  customerInfo: z
    .object({
      name: z.string().min(1, 'Name is required'),
      number: z.string().min(1, 'Phone number is required'),
      city: z.string().min(1, 'City is required'),
      colony: z.string().min(1, 'Colony is required'),
      postOffice: z.string().min(1, 'Post Office is required'),
      subDistrict: z.string().min(1, 'Sub District is required'),
    })
    .partial() // Allows updating only specific fields inside customerInfo
    .optional(),
});

export const orderValidation = {
  orderValidationSchema,
  updateOrderValidationSchema,
};
