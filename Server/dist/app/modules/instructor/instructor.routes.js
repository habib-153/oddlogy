"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const instructor_controller_1 = require("./instructor.controller");
const router = express_1.default.Router();
router.get('/', instructor_controller_1.InstructorControllers.getAllInstructor);
router.get('/my-courses', (0, auth_1.default)(user_constant_1.USER_ROLE.INSTRUCTOR), instructor_controller_1.InstructorControllers.getInstructorCourses);
router.get('/:id', 
//  auth('ADMIN', 'INSTRUCTOR'),
instructor_controller_1.InstructorControllers.getInstructorById);
router.patch('/:id', (0, auth_1.default)('ADMIN'), instructor_controller_1.InstructorControllers.updateInstructorById);
router.delete('/:id', (0, auth_1.default)('ADMIN'), instructor_controller_1.InstructorControllers.deleteInstructorById);
exports.InstructorRoutes = router;
