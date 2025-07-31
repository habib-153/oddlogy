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
exports.EnrollmentControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const enrollment_service_1 = require("./enrollment.service");
const createEnrollment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const enrollmentData = req.body;
    const userId = req.user._id;
    const result = yield enrollment_service_1.EnrollmentServices.createEnrollmentIntoDB(enrollmentData, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Enrollment submitted successfully',
        data: result,
    });
}));
const getAllEnrollments = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield enrollment_service_1.EnrollmentServices.getAllEnrollmentsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Enrollments retrieved successfully',
        data: result,
    });
}));
const updateEnrollmentStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { enrollmentId } = req.params;
    const { status, rejectionReason } = req.body;
    const adminId = req.user._id;
    const result = yield enrollment_service_1.EnrollmentServices.updateEnrollmentStatusIntoDB(enrollmentId, status, adminId, rejectionReason);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Enrollment ${status} successfully`,
        data: result,
    });
}));
exports.EnrollmentControllers = {
    createEnrollment,
    getAllEnrollments,
    updateEnrollmentStatus,
};
