import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken } from '../../utils/verifyJWT';
import { USER_ROLE } from '../User/user.constant';
import { User } from '../User/user.model';
import { GoogleUserData, TLoginUser, TRegisterUser } from './auth.interface';

const registerUser = async (payload: TRegisterUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload?.email);

  if (user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exist!!!');
  }

  // Set default role
  payload.role = USER_ROLE.USER;
  payload.profilePhoto =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

  // Create new user with hashed password
  const newUser = await User.create({
    ...payload
  });

  return newUser;
};

const loginUser = async (payload: TLoginUser) => {
  // Find user by email
  const user = await User.isUserExistsByEmail(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  // Compare hashed password
  const isPasswordValid = await User.isPasswordMatched(
    payload?.password,
    user?.password
  );

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  // Generate JWT token
  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profilePhoto: user.profilePhoto,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    user,
    accessToken,
  };
};

const handleGoogleUser = async (googleUserData: GoogleUserData) => {
  const { email, name, picture, sub } = googleUserData;

  // Check if user already exists
  let user = await User.isUserExistsByEmail(email);

  if (!user) {
    // Create new user for Google login
    user = await User.create({
      name,
      email,
      profilePhoto:
        picture ||
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      role: USER_ROLE.USER,
      googleId: sub, 
      isGoogleUser: true, 
    });
  } else if (!user.googleId) {
    // Update existing user with Google info
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        googleId: sub,
        isGoogleUser: true,
        profilePhoto: picture || user.profilePhoto,
      },
      { new: true }
    );
    
    if (!updatedUser) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update user');
    }
    
    user = updatedUser;
  }

  // Generate JWT token
  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profilePhoto: user.profilePhoto,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    user,
    accessToken,
  };
};

// const changePassword = async (
//   userData: JwtPayload,
//   payload: { oldPassword: string; newPassword: string }
// ) => {
//   // checking if the user is exist
//   const user = await User.isUserExistsByEmail(userData.email);

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
//   }

//   // checking if the user is blocked

//   //checking if the password is correct

//   if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
//     throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

//   //hash new password
//   const newHashedPassword = await bcrypt.hash(
//     payload.newPassword,
//     Number(config.bcrypt_salt_rounds)
//   );

//   await User.findOneAndUpdate(
//     {
//       email: userData.email,
//       role: userData.role,
//     },
//     {
//       password: newHashedPassword,
//       passwordChangedAt: new Date(),
//     }
//   );

//   return null;
// };

// const refreshToken = async (token: string) => {
//   // checking if the given token is valid
//   const decoded = jwt.verify(
//     token,
//     config.jwt_refresh_secret as string
//   ) as JwtPayload;

//   const { email, iat } = decoded;

//   // checking if the user is exist
//   const user = await User.isUserExistsByEmail(email);

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
//   }


//   if (
//     user.passwordChangedAt &&
//     User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
//   ) {
//     throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
//   }

//   const jwtPayload = {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     mobileNumber: user.mobileNumber,
//     role: user.role,
//   };

//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_expires_in as string
//   );

//   return {
//     accessToken,
//   };
// };

// const forgetPassword = async (userEmail: string) => {
//   const user = await User.isUserExistsByEmail(userEmail);

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User does not exist!');
//   }

//   const jwtPayload = {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     mobileNumber: user.mobileNumber,
//     role: user.role,
//   };

//   const resetToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     '20m',
//   );

//   // const resetUILink = `${config.reset_pass_ui_link}?email=${user.email}&token=${resetToken} `;

//   // await EmailHelper.sendEmail(user.email, resetUILink);
// };

// const resetPassword = async (
//   payload: { email: string; newPassword: string },
//   token: string,
// ) => {
//   const user = await User.isUserExistsByEmail(payload.email);
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
//   }

//   const decoded = jwt.verify(
//     token,
//     config.jwt_access_secret as string,
//   ) as JwtPayload;

//   if (payload.email !== decoded.email) {
//     throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
//   }

//   //hash new password
//   const newHashedPassword = await bcrypt.hash(
//     payload.newPassword,
//     Number(config.bcrypt_salt_rounds),
//   );

//   await User.findOneAndUpdate(
//     {
//       email: decoded.email,
//       role: decoded.role,
//     },
//     {
//       password: newHashedPassword,
//       passwordChangedAt: new Date(),
//     },
//   );

//   return null;
// };

export const AuthServices = {
  registerUser,
  loginUser,
  handleGoogleUser,
};
