import { Schema, model } from 'mongoose';
import { ICustomizableMeal } from './cMeal.interface';

const cMealSchema = new Schema<ICustomizableMeal>(
  {
    meal_id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    baseOptions: {
      type: [String],
      required: true,
    },
    proteinOptions: {
      type: [String],
      required: true,
    },
    extras: {
      type: [String],
      required: true,
    },
    dietaryPreferences: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    imgUrl: {
      type: [String],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

export const CustomizableMealModel = model<ICustomizableMeal>(
  'CustomizableMeal',
  cMealSchema,
);
