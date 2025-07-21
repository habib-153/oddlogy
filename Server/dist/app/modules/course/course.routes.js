"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("./course.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const router = express_1.default.Router();
router.post('/', 
// auth(USER_ROLE.ADMIN, USER_ROLE.INSTRUCTOR),
course_controller_1.CourseControllers.createCourse);
router.get('/', course_controller_1.CourseControllers.getAllCourses);
router.get('/home', course_controller_1.CourseControllers.getAllCoursesForHome);
router.get('/:id', course_controller_1.CourseControllers.getCourseById);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.INSTRUCTOR), course_controller_1.CourseControllers.updateCourse);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), course_controller_1.CourseControllers.deleteCourse);
router.post('/enroll/:courseId', (0, auth_1.default)(user_constant_1.USER_ROLE.USER), course_controller_1.CourseControllers.enrollCourse);
exports.CourseRoutes = router;
