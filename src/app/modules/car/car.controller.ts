/* eslint-disable @typescript-eslint/no-explicit-any */
import { CarService } from './car.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import customizedMsg from '../../utils/customisedMsg';
import validateRequest from '../../MiddleWares/validateRequest';
import { carValidations } from './car.validation';

// Function to create a new car

const carCreateFun = catchAsync(async (req, res) => {
  // console.log(req.files);

  const data = JSON.parse(req.body.data);
  const imgUrl = Array.isArray(req.files)
    ? req.files.map((file) => file.path)
    : [];

  // For debugging purposes

  data['isDeleted'] = false;
  data['inStock'] = true;

  const payLoad = { ...data, imgUrl };
  // console.log(payLoad);

  validateRequest(carValidations.carValidationSchema);

  const result = await CarService.postCarDataIntoDB(payLoad);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Car's Data created successfully`,
    data: result,
  });
});

// Function to get all cars by a search term

const getAllCarFun = catchAsync(async (req, res) => {
  // console.log(req.cookies);
  const result = await CarService.getAllCars(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: customizedMsg(result?.result, 'Cars'),
    data: result,
  });
});

const updateACarFun = catchAsync(async (req, res) => {
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
  // console.log(payLoad);
  const result = await CarService.updateACarData(id, payLoad);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Car's Data Updated Successfully`,
    data: result,
  });
});

// Function to delete a car
const deleteACarFun = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CarService.deleteACarData(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car Deleted Successfully',
    data: result,
  });
});

// Function to get a single car
const getACarFun = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CarService.getACar(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car Retrived Successfully',
    data: result,
  });
});

export const carController = {
  carCreateFun,
  getAllCarFun,
  getACarFun,
  updateACarFun,
  deleteACarFun,
};
