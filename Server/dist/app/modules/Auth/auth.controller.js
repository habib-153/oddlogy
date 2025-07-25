"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const catchAsync_1 = require("../../utils/catchAsync");
const registerUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.registerUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'User registered successfully!',
        data: result,
    });
}));
// Simplified login controller
const loginUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.loginUser(req.body);
    const { user, accessToken } = result;
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User successfully logged in!',
        data: {
            user,
            accessToken,
        },
    });
}));
const handleGoogleAuth = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { googleUserData } = req.body;
    const result = yield auth_service_1.AuthServices.handleGoogleUser(googleUserData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Google authentication successful',
        data: result,
    });
}));
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
exports.AuthControllers = {
    registerUser,
    loginUser,
    handleGoogleAuth,
};
