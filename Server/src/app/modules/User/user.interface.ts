/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  _id?: string;
  name: string;
  role: keyof typeof USER_ROLE;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  googleId?: string;
  isGoogleUser?: boolean;
  gender?: string;
  dateOfBirth?: Date;
  mobileNumber?: string;
  profilePhoto?: string;
  enrolledCourses?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
};

export interface IUserModel extends Model<TUser> {
  isUserExistsByEmail(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}
