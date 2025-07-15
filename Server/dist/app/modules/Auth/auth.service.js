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
exports.AuthServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const verifyJWT_1 = require("../../utils/verifyJWT");
const user_constant_1 = require("../User/user.constant");
const user_model_1 = require("../User/user.model");
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsByEmail(payload === null || payload === void 0 ? void 0 : payload.email);
    if (user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User already exist!!!');
    }
    // Hash the password
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    // Set default role
    payload.role = user_constant_1.USER_ROLE.USER;
    // Create new user with hashed password
    const newUser = yield user_model_1.User.create(Object.assign(Object.assign({}, payload), { password: hashedPassword }));
    return newUser;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Find user by email
    const user = yield user_model_1.User.isUserExistsByEmail(payload === null || payload === void 0 ? void 0 : payload.email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid email or password');
    }
    // Compare hashed password
    const isPasswordValid = yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordValid) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid email or password');
    }
    // Generate JWT token
    const jwtPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, verifyJWT_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        user,
        accessToken,
    };
});
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
exports.AuthServices = {
    registerUser,
    loginUser,
};
