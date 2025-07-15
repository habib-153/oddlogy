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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const module_model_1 = require("../module/module.model");
const course_model_1 = require("./course.model");
const mongoose_1 = require("mongoose");
const user_model_1 = require("../User/user.model");
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const CourseSearchableFields = ['title', 'description', 'courseType'];
const createCourseIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.create(payload);
    return result;
});
const getAllCoursesForHomeFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield course_model_1.Course.find({ isDeleted: false })
        .select('-modules -students')
        .populate({
        path: 'instructor',
        select: 'name profilePhoto',
    });
    return result;
});
const getAllCoursesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const courseQueryBuilder = new QueryBuilder_1.QueryBuilder(course_model_1.Course.find({ isDeleted: false }), query)
        .search(CourseSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield courseQueryBuilder.modelQuery
        .populate({
        path: 'instructor',
        select: 'name email profilePhoto',
    })
        .populate({
        path: 'modules',
        match: { isDeleted: false },
        select: 'name module_number video_url description isCompleted',
        options: { sort: { module_number: 1 } },
    });
    const meta = yield courseQueryBuilder.countTotal();
    return { result, meta };
});
const getCourseByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.Course.findById(id)
        .populate({
        path: 'instructor',
        select: 'name email profilePhoto',
    })
        .populate({
        path: 'modules',
        match: { isDeleted: false },
        select: 'name module_number video_url description isCompleted',
        options: { sort: { module_number: 1 } },
    });
    if (!course) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Course not found');
    }
    return course;
});
const updateCourseByIdIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCourse = yield course_model_1.Course.findById(id);
    if (!existingCourse) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Course not found');
    }
    const { media, prerequisites } = payload, otherFields = __rest(payload, ["media", "prerequisites"]);
    const updateData = Object.assign({}, otherFields);
    if (media) {
        Object.keys(media).forEach((key) => {
            updateData[`media.${key}`] = media[key];
        });
    }
    if (prerequisites) {
        updateData.prerequisites = prerequisites;
    }
    const course = yield course_model_1.Course.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    })
        .populate({
        path: 'instructor',
        select: 'name email profilePhoto',
    })
        .populate({
        path: 'modules',
        match: { isDeleted: false },
        select: 'name module_number video_url description isCompleted',
        options: { sort: { module_number: 1 } },
    });
    return course;
});
const deleteCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.Course.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!course) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Course not found');
    }
    // Also mark all related modules as deleted
    yield module_model_1.Module.updateMany({ course: new mongoose_1.Types.ObjectId(id) }, { isDeleted: true });
    return course;
});
const enrollCourseIntoDB = (courseId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_model_1.Course.findById(courseId);
    if (!course) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Course not found');
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Check if user is already enrolled in the course
    const isEnrolled = course.students.includes(new mongoose_1.Types.ObjectId(userId));
    if (isEnrolled) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User already enrolled in this course');
    }
    // Use transactions to ensure both operations succeed or fail together
    const session = yield course_model_1.Course.startSession();
    try {
        session.startTransaction();
        // Update the course document
        const updatedCourse = yield course_model_1.Course.findByIdAndUpdate(courseId, {
            $addToSet: { students: userId },
            $inc: { studentEnrolled: 1 },
        }, { new: true, session });
        // Update the user document
        yield user_model_1.User.findByIdAndUpdate(userId, {
            $addToSet: { enrolledCourses: courseId },
        }, { session });
        yield session.commitTransaction();
        return updatedCourse;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
exports.CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getAllCoursesForHomeFromDB,
    getCourseByIdFromDB,
    updateCourseByIdIntoDB,
    deleteCourseFromDB,
    enrollCourseIntoDB,
};
