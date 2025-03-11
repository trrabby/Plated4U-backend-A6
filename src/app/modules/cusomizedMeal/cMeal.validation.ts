import { z } from 'zod';

// Validation schema for creating a new Customizable Meal
const cMealValidationSchema = z.object({
  meal_id: z.string().min(1, { message: 'Meal ID is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  baseOptions: z
    .array(z.string())
    .min(1, { message: 'Base options are required.' }),
  proteinOptions: z
    .array(z.string())
    .min(1, { message: 'Protein options are required.' }),
  extras: z.array(z.string()).min(1, { message: 'Extras are required.' }),
  dietaryPreferences: z
    .array(z.string())
    .min(1, { message: 'Dietary preferences are required.' }),
  price: z.number().positive({ message: 'Price must be a positive number.' }),
  calories: z
    .number()
    .nonnegative({ message: 'Calories must be a non-negative number.' }),
  imgUrl: z.array(z.string()).min(1, { message: 'Image URL is required.' }),
});

// Validation schema for updating a Customizable Meal
const cMealUpdateValidationSchema = z.object({
  body: z.object({
    meal_id: z.string().min(1, { message: 'Meal ID is required.' }).optional(),
    name: z.string().min(1, { message: 'Name is required.' }).optional(),
    description: z
      .string()
      .min(1, { message: 'Description is required.' })
      .optional(),
    baseOptions: z
      .array(z.string())
      .min(1, { message: 'Base options are required.' })
      .optional(),
    proteinOptions: z
      .array(z.string())
      .min(1, { message: 'Protein options are required.' })
      .optional(),
    extras: z
      .array(z.string())
      .min(1, { message: 'Extras are required.' })
      .optional(),
    dietaryPreferences: z
      .array(z.string())
      .min(1, { message: 'Dietary preferences are required.' })
      .optional(),
    price: z
      .number()
      .positive({ message: 'Price must be a positive number.' })
      .optional(),
    calories: z
      .number()
      .nonnegative({ message: 'Calories must be a non-negative number.' })
      .optional(),
    imgUrl: z
      .array(z.string())
      .min(1, { message: 'Image URL is required.' })
      .optional(),
  }),
});

export const cMealValidations = {
  cMealValidationSchema,
  cMealUpdateValidationSchema,
};
