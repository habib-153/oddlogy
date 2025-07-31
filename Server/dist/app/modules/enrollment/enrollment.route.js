"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const enrollment_controller_1 = require("./enrollment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.INSTRUCTOR, user_constant_1.USER_ROLE.ADMIN), enrollment_controller_1.EnrollmentControllers.createEnrollment);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), enrollment_controller_1.EnrollmentControllers.getAllEnrollments);
router.patch('/:enrollmentId/status', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), enrollment_controller_1.EnrollmentControllers.updateEnrollmentStatus);
exports.EnrollmentRoutes = router;
