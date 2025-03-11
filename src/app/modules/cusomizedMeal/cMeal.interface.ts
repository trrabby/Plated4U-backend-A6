export interface ICustomizableMeal {
  meal_id: string;
  name: string;
  description: string;
  baseOptions: string[];
  proteinOptions: string[];
  extras: string[];
  dietaryPreferences: string[];
  price: number;
  calories: number;
  imgUrl: string[];
  isDeleted: boolean;
}
