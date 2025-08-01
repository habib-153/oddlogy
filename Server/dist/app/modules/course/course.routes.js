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
const multer_config_1 = require("../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.INSTRUCTOR), multer_config_1.multerUpload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
]), bodyParser_1.parseBody, course_controller_1.CourseControllers.createCourse);
router.get('/', course_controller_1.CourseControllers.getAllCourses);
router.get('/home', course_controller_1.CourseControllers.getAllCoursesForHome);
router.get('/:id', course_controller_1.CourseControllers.getCourseById);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.INSTRUCTOR), multer_config_1.multerUpload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
]), bodyParser_1.parseBody, course_controller_1.CourseControllers.updateCourse);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), course_controller_1.CourseControllers.deleteCourse);
router.get('/user/:userId', course_controller_1.CourseControllers.getUserCourses);
router.post('/enroll/:courseId', (0, auth_1.default)(user_constant_1.USER_ROLE.USER), course_controller_1.CourseControllers.enrollCourse);
exports.CourseRoutes = router;
