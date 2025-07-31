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
exports.InstructorServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../User/user.model");
const course_model_1 = require("../course/course.model");
const getAllInstructorsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const instructors = yield user_model_1.User.find({ role: 'INSTRUCTOR', isDeleted: false }).select('-password -__v');
    return instructors;
});
const getInstructorByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const instructor = yield user_model_1.User.findById(id).select('-password -__v');
    if (!instructor) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Instructor not found');
    }
    return instructor;
});
const updateInstructorByIdFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const instructor = yield user_model_1.User.findByIdAndUpdate(id, payload, { new: true }).select('-password -__v');
    if (!instructor) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Instructor not found');
    }
    return instructor;
});
const deleteInstructorByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const instructor = yield user_model_1.User.findByIdAndUpdate(id, { isDeleted: true }).select('-password -__v');
    if (!instructor) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Instructor not found');
    }
    return instructor;
});
const getInstructorCourses = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // Find instructor by email
    const instructor = yield user_model_1.User.findOne({ email: user.email });
    if (!instructor) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Instructor not found');
    }
    // Find courses where this instructor is assigned
    const courses = yield course_model_1.Course.find({
        instructor: instructor._id,
        isDeleted: false
    })
        .populate('instructor', 'name email profilePhoto')
        .select('-__v')
        .sort({ createdAt: -1 });
    return {
        courses,
        total: courses.length
    };
});
exports.InstructorServices = {
    getAllInstructorsFromDB,
    getInstructorByIdFromDB,
    updateInstructorByIdFromDB,
    deleteInstructorByIdFromDB,
    getInstructorCourses,
};
