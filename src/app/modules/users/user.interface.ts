import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface IUser {
  name: string;
  email: string;
  password: string;
  city: string;
  colony: string;
  postOffice: string;
  subDistrict: string;
  number: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  imgUrl?: string;
  role: 'admin' | 'mealProvider' | 'customer';
  isDeleted: boolean;
  status: 'active' | 'blocked';
}

export interface UserModelStatic extends Model<IUser> {
  //instance methods for checking if the user exist
  isUserExistsByEmail(id: string): Promise<IUser | null>;

  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  //instance methods for checking if the jwt is issued before the password is changed
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
