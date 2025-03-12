/* eslint-disable @typescript-eslint/no-explicit-any */

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import customizedMsg from '../../utils/customisedMsg';
import validateRequest from '../../MiddleWares/validateRequest';

import { MealService } from './cMeal.service';
import { cMealValidations } from './cMeal.validation';

// Function to create a new car

const cMealCreateFun = catchAsync(async (req, res) => {
  // console.log(req.files);

  const data = JSON.parse(req.body.data);
  const imgUrl = Array.isArray(req.files)
    ? req.files.map((file) => file.path)
    : [];

  const payLoad = { ...data, imgUrl };
  // console.log(payLoad);

  validateRequest(cMealValidations.cMealValidationSchema);

  const result = await MealService.postMealDataIntoDB(payLoad);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Meal's Data created successfully`,
    data: result,
  });
});

// // Function to get all cars by a search term

const getAllMealFun = catchAsync(async (req, res) => {
  // console.log(req.cookies);
  const result = await MealService.getAllMeals(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: customizedMsg(result?.result, 'Cars'),
    data: result,
  });
});

const updateMealFun = catchAsync(async (req, res) => {
  const { id } = req.params;

  const data = JSON.parse(req.body.data);

  const imgUrl: string[] = data.previousUploadedImg || [];
  delete data.previousUploadedImg;

  const newUploadedImgUrl = Array.isArray(req.files)
    ? req.files.map((file) => file.path)
    : [];
  if (newUploadedImgUrl.length > 0) {
    imgUrl.push(...newUploadedImgUrl);
  }
  // console.log(imgUrl);

  const payLoad = { ...data, imgUrl };
  validateRequest(cMealValidations.cMealUpdateValidationSchema);

  const result = await MealService.updateAMealData(id, payLoad);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Meal's Data Updated Successfully`,
    data: result,
  });
});

// // Function to delete a car
const deleteAMealFun = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MealService.deleteAMealData(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meal Deleted Successfully',
    data: result,
  });
});

const getMealFun = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MealService.getAMeal(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car Retrived Successfully',
    data: result,
  });
});

export const cMealController = {
  cMealCreateFun,
  getAllMealFun,
  updateMealFun,
  deleteAMealFun,
  getMealFun,
};
