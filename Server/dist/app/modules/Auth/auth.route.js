"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
router.post('/register', 
//validateRequest(AuthValidation.registerValidationSchema),
auth_controller_1.AuthControllers.registerUser);
router.post('/login', 
//validateRequest(AuthValidation.loginValidationSchema),
auth_controller_1.AuthControllers.loginUser);
// router.post(
//   '/change-password',
//   auth(USER_ROLE.USER, USER_ROLE.ADMIN),
//   validateRequest(AuthValidation.changePasswordValidationSchema),
//   AuthControllers.changePassword
// );
// router.post('/forgot-password', AuthControllers.forgotPassword);
// router.post('/reset-password', AuthControllers.resetPassword);
// router.post(
//   '/refresh-token',
//   validateRequestCookies(AuthValidation.refreshTokenValidationSchema),
//   AuthControllers.refreshToken
// );
exports.AuthRoutes = router;
