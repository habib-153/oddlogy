import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { catchAsync } from '../../utils/catchAsync';


const registerUser = catchAsync(async (req, res) => {
  const result = await AuthServices.registerUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully!',
    data: result,
  });
});

// Simplified login controller
const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { user, accessToken } = result;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User successfully logged in!',
    data: {
      user,
      accessToken,
    },
  });
});

const handleGoogleAuth = catchAsync(async (req, res) => {
  const { googleUserData } = req.body;

  const result = await AuthServices.handleGoogleUser(googleUserData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Google authentication successful',
    data: result,
  });
});

// const registerUser = catchAsync(async (req, res) => {
//   const result = await AuthServices.registerUser(req.body);
//   const { refreshToken, accessToken } = result;

//   res.cookie('refreshToken', refreshToken, {
//     secure: config.NODE_ENV === 'production',
//     httpOnly: true,
//   });

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'User registered in successfully!',
//     data: {
//       accessToken,
//       refreshToken,
//     },
//   });
// });

// const loginUser = catchAsync(async (req, res) => {
//   const result = await AuthServices.loginUser(req.body);
//   const { refreshToken, accessToken } = result;

//   res.cookie('refreshToken', refreshToken, {
//     secure: config.NODE_ENV === 'production',
//     httpOnly: true,
//   });

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'User logged in successfully!',
//     data: {
//       accessToken,
//       refreshToken,
//     },
//   });
// });

// const changePassword = catchAsync(async (req, res) => {

//   const result = await AuthServices.changePassword(req.user, req.body);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Password updated successfully!',
//     data: result,
//   });
// });

// const refreshToken = catchAsync(async (req, res) => {
//   const { refreshToken } = req.cookies;
//   const result = await AuthServices.refreshToken(refreshToken);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Access token retrieved successfully!',
//     data: result,
//   });
// });

// const forgotPassword = catchAsync(async (req, res) => {
//   const userEmail = req?.body?.email;
//   const result = await AuthServices.forgetPassword(userEmail);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Reset link is generated successfully!',
//     data: result,
//   });
// });

// const resetPassword = catchAsync(async (req, res) => {
//   const token = req.headers.authorization;

//   const result = await AuthServices.resetPassword(req.body, token as string);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Password reset successful!',
//     data: result,
//   });
// });

export const AuthControllers = {
  registerUser,
  loginUser,
  handleGoogleAuth,
};
