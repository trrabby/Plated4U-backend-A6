import mongoose from 'mongoose';
import AppError from '../../errorHandlers/AppError';
import { TOrder } from './order.interface';
import { OrderModel } from './order.model';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { CustomizableMealModel } from '../cusomizedMeal/cMeal.model';

const orderSearchableFields = ['email', 'status'];

const postOrderDataIntoDB = async (orderData: TOrder) => {
  const session = await mongoose.startSession(); // Start session

  try {
    const result = await session.withTransaction(async () => {
      const { orderInfo, totalPrice } = orderData;
      let calculatedTotalPrice = 0;

      if (orderInfo) {
        for (const singleOrder of orderInfo) {
          const id = singleOrder.productId;
          const mealData =
            await CustomizableMealModel.findById(id).session(session);

          if (!mealData) {
            throw new AppError(
              httpStatus.NOT_FOUND,
              `Meal with ID ${singleOrder.productId} not found in database.`,
            );
          }

          // Calculate total price from backend
          calculatedTotalPrice += mealData.price * singleOrder.orderedQuantity;
        }
      }

      // Validate if frontend totalPrice matches backend-calculated totalPrice
      if (calculatedTotalPrice !== totalPrice) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Total price mismatch. Expected: ${calculatedTotalPrice}, Received: ${totalPrice}`,
        );
      }

      // Create the order with the same orderInfo structure
      const newOrder = await OrderModel.create([orderData], { session });
      return newOrder; // Return the newly created order
    });

    return result;
  } catch (error) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Something went wrong, ${error}`,
    );
  } finally {
    session.endSession(); // Always close session after transaction
  }
};

const getAllOrders = async (query: Record<string, unknown>) => {
  const ordersQuery = new QueryBuilder(OrderModel.find(), query)
    .search(orderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ordersQuery.modelQuery
    .sort({ _id: -1 })
    .populate({
      path: 'orderInfo.productId', // The field to populate
      select: 'name price imgUrl', // Fields to select from the populated document
    })
    .select('-__v'); // Optionally exclude fields from the main document (e.g., exclude `__v`)

  const meta = await ordersQuery.countTotal();

  return { meta, result };
};

const getAnOrder = async (id: string) => {
  const result = await OrderModel.find({ _id: id }).populate({
    path: 'orderInfo.productId', // The field to populate
  });
  return result;
};

const updateAnOrder = async (id: string, payload: Partial<TOrder>) => {
  const result = await OrderModel.findOneAndUpdate({ _id: id }, payload, {
    new: true, // Return the updated document
    runValidators: true, // Run schema validators
  });
  return result;
};

const getRevenue = async () => {
  const revenuePipeline: mongoose.PipelineStage[] = [
    { $unwind: '$orderInfo' }, // Flatten orderInfo array
    {
      $lookup: {
        from: 'meals', // Reference meals collection
        localField: 'orderInfo.productId',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    { $unwind: '$productDetails' }, // Flatten productDetails array
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          model: '$productDetails.model',
        }, // Group by year and model
        brand: { $first: '$productDetails.brand' }, // Get brand
        totalRevenue: {
          $sum: {
            $multiply: ['$orderInfo.orderedQuantity', '$productDetails.price'],
          },
        },
        noOfmealsSold: { $sum: '$orderInfo.orderedQuantity' },
      },
    },
    {
      $group: {
        _id: '$_id.year', // Group by year
        models: {
          $push: {
            model: '$_id.model',
            brand: '$brand',
            totalRevenue: '$totalRevenue',
            noOfmealsSold: '$noOfmealsSold',
            sellingPriceAvg: {
              // Calculate average selling price per model
              $cond: {
                if: { $eq: ['$noOfmealsSold', 0] }, // Check if noOfmealsSold is 0
                then: 0, // Set to 0 if no meals were sold
                else: {
                  $divide: ['$totalRevenue', '$noOfmealsSold'],
                },
              },
            },
          },
        },
        totalRevenue: { $sum: '$totalRevenue' },
        noOfmealsSold: { $sum: '$noOfmealsSold' },
      },
    },
    {
      $project: {
        _id: 0,
        year: '$_id',
        totalRevenue: 1,
        noOfmealsSold: 1,
        models: 1,
      },
    },
    {
      $sort: { year: -1 }, // Sort documents by year
    },
    {
      $addFields: {
        models: {
          $sortArray: {
            input: '$models',
            sortBy: { totalRevenue: -1 }, // Sort models by totalRevenue in descending order
          },
        },
      },
    },
  ];

  return await OrderModel.aggregate(revenuePipeline);
};

const getMyOrders = async (query: Record<string, unknown>, email: string) => {
  const myOrdersQuery = new QueryBuilder(OrderModel.find({ email }), query)
    .search(orderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await myOrdersQuery.modelQuery
    .sort({ _id: -1 })
    .populate({
      path: 'orderInfo.productId', // The field to populate
      select: 'brand model year price', // Fields to select from the populated document
    })
    .select('-__v'); // Optionally exclude fields from the main document (e.g., exclude `__v`)

  const meta = await myOrdersQuery.countTotal();

  return { meta, result };
};

export const OrderService = {
  postOrderDataIntoDB,
  getAllOrders,
  getAnOrder,
  updateAnOrder,
  getRevenue,
  getMyOrders,
};
