import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.services';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import customizedMsg from '../../utils/customisedMsg';

const registerUser = catchAsync(async (req, res) => {
  const data = JSON.parse(req.body.data);
  const imgUrl = req.file?.path;

  const user = await UserServices.registerNewUserIntoDB({
    ...data,
    imgUrl,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${user.user.role} is created successfully`,
    data: user,
  });
});

export { registerUser };

const AllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.findAllUsers(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: customizedMsg(result?.result, 'Users'),
    data: result,
  });
});

const updateAUserFun = catchAsync(async (req, res) => {
  const { email } = req.params;
  const payLoad = req.body;

  const result = await UserServices.updateAUser(email, payLoad);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User updated successfull`,
    data: result,
  });
});

const deleteAUserFun = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.deleteAUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User deleted successfully`,
    data: result,
  });
});
export const UserControllers = {
  registerUser,
  AllUsers,
  updateAUserFun,
  deleteAUserFun,
};
