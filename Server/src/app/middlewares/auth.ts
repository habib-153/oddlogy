import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { catchAsync } from '../utils/catchAsync';
import { USER_ROLE } from '../modules/User/user.constant';
import { verifyToken } from '../utils/verifyJWT';
import { User } from '../modules/User/user.model';

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;

    // checking if the token is missing
    if (!authorizationHeader) {
      console.log(`Authorization Header: ${authorizationHeader}`);
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // Extract token from "Bearer <token>" format
    const token = authorizationHeader.startsWith('Bearer ')
      ? authorizationHeader.substring(7)
      : authorizationHeader;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    console.log('Token received:', token.substring(0, 20) + '...');

    const decoded = verifyToken(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    const { role, email, iat } = decoded;

    // checking if the user is exist
    const user = await User.isUserExistsByEmail(email);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;