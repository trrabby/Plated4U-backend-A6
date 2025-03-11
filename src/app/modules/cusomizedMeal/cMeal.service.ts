import QueryBuilder from '../../builder/QueryBuilder';
import { ICustomizableMeal } from './cMeal.interface';
import { CustomizableMealModel } from './cMeal.model';

export const mealSearchableFields = [
  'name',
  'description',
  'baseOptions',
  'proteinOptions',
  'extras',
  'dietaryPreferences',
];

const postMealDataIntoDB = async (mealData: ICustomizableMeal) => {
  const result = await CustomizableMealModel.create(mealData);
  return result;
};

const getAllMeals = async (query: Record<string, unknown>) => {
  const MealsQuery = new QueryBuilder(CustomizableMealModel.find(), query)
    .search(mealSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await MealsQuery.modelQuery.sort({ _id: -1 }).find({
    $or: [
      { isDeleted: { $exists: false } }, // Documents where `isDeleted` does not exist
      { isDeleted: false }, // Documents where `isDeleted` is explicitly false
    ],
  });
  const meta = await MealsQuery.countTotal();

  return { meta, result };
};

// const updateAMealData = async (
//   id: string,
//   payload: Partial<TMeal>,
//   session?: mongoose.ClientSession, // Optional session parameter for transactions came from the controller.
// ) => {
//   const result = await MealModel.findOneAndUpdate(
//     { _id: id }, // Match the document where the id matches
//     payload, // Apply the update
//     {
//       new: true, // Return the updated document
//       runValidators: true, // Run schema validators
//       session: session || undefined, // Included session if provided
//     },
//   );
//   return result;
// };

// const deleteAMealData = async (id: string) => {
//   const result = await MealModel.findOneAndUpdate(
//     { _id: id }, // Match the document where the email matches
//     { $set: { isDeleted: true } }, // Add the field `isDeleted` and set it to true
//     {
//       new: true, // Return the updated document
//       runValidators: true, // Run schema validators
//     },
//   );
//   return result;
// };

// const getAMeal = async (id: string) => {
//   const result = await MealModel.find({ _id: id });
//   return result;
// };
export const MealService = {
  postMealDataIntoDB,
  getAllMeals,
};
