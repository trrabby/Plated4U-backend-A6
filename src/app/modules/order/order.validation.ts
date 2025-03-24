import { z } from 'zod';

export const orderValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address.'),
    orderInfo: z.array(
      z.object({
        name: z.string().min(1, 'Product ID is required.'),
        description: z.string().min(1, 'Product ID is required.'),
        productId: z.string().min(1, 'Product ID is required.'),
        baseOptions: z.string().min(1, 'Base option is required.'),
        proteinOptions: z.string().min(1, 'Protein option is required.'),
        dietaryPreferences: z
          .string()
          .min(1, 'Dietary preference is required.'),
        extras: z
          .array(z.string().min(1, 'Extra item is required.'))
          .min(1, 'At least one extra is required.'),
        orderedQuantity: z
          .number()
          .positive('Product quantity must be greater than 0.'),
        price: z.number().positive('Price must be greater than 0.'),
      }),
    ),
    totalPrice: z.number().positive('Total price must be greater than 0.'),
    paymentStatus: z
      .enum(['Pending', 'Paid', 'Failed', 'Unpaid'])
      .default('Unpaid'),
    orderStatus: z
      .enum(['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Canceled'])
      .default('Pending'),
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
        baseOptions: z.string().min(1, 'Base option is required.').optional(),
        proteinOptions: z
          .string()
          .min(1, 'Protein option is required.')
          .optional(),
        dietaryPreferences: z
          .string()
          .min(1, 'Dietary preference is required.')
          .optional(),
        extras: z
          .array(z.string().min(1, 'Extra item is required.'))
          .optional(),
        orderedQuantity: z
          .number()
          .min(1, 'Quantity must be at least 1')
          .optional(),
        price: z.number().min(0, 'Price cannot be negative').optional(),
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
      name: z.string().min(1, 'Name is required').optional(),
      number: z.string().min(1, 'Phone number is required').optional(),
      city: z.string().min(1, 'City is required').optional(),
      colony: z.string().min(1, 'Colony is required').optional(),
      postOffice: z.string().min(1, 'Post Office is required').optional(),
      subDistrict: z.string().min(1, 'Sub District is required').optional(),
    })
    .optional(),
});

export const orderValidation = {
  orderValidationSchema,
  updateOrderValidationSchema,
};
