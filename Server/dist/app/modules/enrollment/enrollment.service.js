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
exports.EnrollmentServices = void 0;
const enrollment_model_1 = require("./enrollment.model");
const course_model_1 = require("../course/course.model");
const user_model_1 = require("../User/user.model");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createEnrollmentIntoDB = (enrollmentData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if course exists
    const course = yield course_model_1.Course.findById(enrollmentData.courseId);
    if (!course) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Course not found');
    }
    // Check if user already enrolled or has pending enrollment
    const existingEnrollment = yield enrollment_model_1.Enrollment.findOne({
        courseId: enrollmentData.courseId,
        studentId: userId,
        isDeleted: false,
    });
    if (existingEnrollment) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `You already have a ${existingEnrollment.status} enrollment for this course`);
    }
    // Create enrollment
    const enrollment = yield enrollment_model_1.Enrollment.create(Object.assign(Object.assign({}, enrollmentData), { studentId: userId }));
    return enrollment;
});
const getAllEnrollmentsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, courseId } = query;
    const filter = { isDeleted: false };
    if (status)
        filter.status = status;
    if (courseId)
        filter.courseId = courseId;
    const enrollments = yield enrollment_model_1.Enrollment.find(filter)
        .populate('courseId', 'title courseCategory price salePrice')
        .populate('studentId', 'name email')
        .populate('approvedBy', 'name')
        .sort({ createdAt: -1 });
    return enrollments;
});
const updateEnrollmentStatusIntoDB = (enrollmentId, status, adminId, rejectionReason) => __awaiter(void 0, void 0, void 0, function* () {
    const enrollment = yield enrollment_model_1.Enrollment.findById(enrollmentId);
    if (!enrollment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Enrollment not found');
    }
    if (enrollment.status !== 'pending') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Only pending enrollments can be updated');
    }
    const updateData = {
        status,
        approvedBy: adminId,
        approvalDate: new Date(),
    };
    if (status === 'rejected' && rejectionReason) {
        updateData.rejectionReason = rejectionReason;
    }
    const updatedEnrollment = yield enrollment_model_1.Enrollment.findByIdAndUpdate(enrollmentId, updateData, { new: true });
    // If approved, add student to course
    if (status === 'approved') {
        yield course_model_1.Course.findByIdAndUpdate(enrollment.courseId, {
            $addToSet: { students: enrollment.studentId },
            $inc: { studentEnrolled: 1 },
        });
        yield user_model_1.User.findByIdAndUpdate(enrollment.studentId, {
            $addToSet: { enrolledCourses: enrollment.courseId },
        });
    }
    return updatedEnrollment;
});
exports.EnrollmentServices = {
    createEnrollmentIntoDB,
    getAllEnrollmentsFromDB,
    updateEnrollmentStatusIntoDB,
};
