import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EnrollmentServices } from './enrollment.service';

const createEnrollment = catchAsync(async (req, res) => {
  const enrollmentData = req.body;
  const userId = req.user._id;

  const result = await EnrollmentServices.createEnrollmentIntoDB(
    enrollmentData,
    userId
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Enrollment submitted successfully',
    data: result,
  });
});

const getAllEnrollments = catchAsync(async (req, res) => {
  const result = await EnrollmentServices.getAllEnrollmentsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrollments retrieved successfully',
    data: result,
  });
});

const updateEnrollmentStatus = catchAsync(async (req, res) => {
  const { enrollmentId } = req.params;
  const { status, rejectionReason } = req.body;
  const adminId = req.user._id;

  const result = await EnrollmentServices.updateEnrollmentStatusIntoDB(
    enrollmentId,
    status,
    adminId,
    rejectionReason
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Enrollment ${status} successfully`,
    data: result,
  });
});

export const EnrollmentControllers = {
  createEnrollment,
  getAllEnrollments,
  updateEnrollmentStatus,
};
