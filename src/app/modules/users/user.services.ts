/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errorHandlers/AppError';
import { userSearchableFields } from './user.constant';
import { IUser } from './user.interface';
import httpStatus from 'http-status';
import { UserModel } from './user.model';
import { createToken } from '../auth/auth.utils';
import config from '../../config';

const registerNewUserIntoDB = async (payload: IUser) => {
  //set default user role
  payload.role = 'user';

  // console.log(payload);

  try {
    // create a user
    const user = await UserModel.create(payload);
    //create a student
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    let accessToken = '';
    let refreshToken = '';

    if (user) {
      const jwtPayload = {
        email: user.email,
        role: user.role,
        name: user.name,
        imgUrl: user.imgUrl,
      };

      accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
      );

      refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string,
      );
    }

    return {
      user,
      accessToken: `Bearer ${accessToken}`,
      // accessToken,
      refreshToken: `Bearer ${refreshToken}`,
      needsPasswordChange: user?.needsPasswordChange,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

const findAllUsers = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(UserModel.find(), query)
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const meta = await userQuery.countTotal();
  const result = await userQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const updateAUser = async (id: string, payload: Partial<IUser>) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const result = await UserModel.findOneAndUpdate({ _id: id }, payload, {
    new: true, // Return the updated document
    runValidators: true, // Run schema validators
  });
  return result;
};

const deleteAUser = async (id: string) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const result = await UserModel.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    },
  );
  return result;
};

export const UserServices = {
  registerNewUserIntoDB,
  findAllUsers,
  updateAUser,
  deleteAUser,
};
