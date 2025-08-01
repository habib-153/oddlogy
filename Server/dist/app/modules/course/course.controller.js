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
exports.CourseControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const course_service_1 = require("./course.service");
const createCourse = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const courseData = req.body;
    // Handle uploaded images
    if (files) {
        if (files.banner && files.banner[0]) {
            courseData.media = courseData.media || {};
            courseData.media.banner = files.banner[0].path;
        }
        if (files.thumbnail && files.thumbnail[0]) {
            courseData.media = courseData.media || {};
            courseData.media.thumbnail = files.thumbnail[0].path;
        }
    }
    const result = yield course_service_1.CourseServices.createCourseIntoDB(courseData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Course created successfully',
        data: result,
    });
}));
const getAllCourses = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield course_service_1.CourseServices.getAllCoursesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Courses retrieved successfully',
        data: courses,
    });
}));
const getAllCoursesForHome = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield course_service_1.CourseServices.getAllCoursesForHomeFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Courses retrieved successfully',
        data: courses,
    });
}));
const getCourseById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const course = yield course_service_1.CourseServices.getCourseByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Course retrieved successfully',
        data: course,
    });
}));
const updateCourse = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const files = req.files;
    const updateData = req.body;
    // Handle uploaded images for updates
    if (files) {
        if (files.banner && files.banner[0]) {
            updateData.media = updateData.media || {};
            updateData.media.banner = files.banner[0].path;
        }
        if (files.thumbnail && files.thumbnail[0]) {
            updateData.media = updateData.media || {};
            updateData.media.thumbnail = files.thumbnail[0].path;
        }
    }
    const result = yield course_service_1.CourseServices.updateCourseByIdIntoDB(id, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Course updated successfully',
        data: result,
    });
}));
const deleteCourse = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield course_service_1.CourseServices.deleteCourseFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Course deleted successfully',
        data: null,
    });
}));
const enrollCourse = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const userId = req.user._id;
    const result = yield course_service_1.CourseServices.enrollCourseIntoDB(courseId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Successfully enrolled in course',
        data: result,
    });
}));
const getUserCourses = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield course_service_1.CourseServices.getUserCoursesFromDB(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'User courses retrieved successfully',
        data: result,
    });
}));
exports.CourseControllers = {
    createCourse,
    getAllCoursesForHome,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollCourse,
    getUserCourses,
};
