/* eslint-disable @typescript-eslint/no-explicit-any */
import { TEnrollment } from './enrollment.interface';
import { Enrollment } from './enrollment.model';
import { Course } from '../course/course.model';
import { User } from '../User/user.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

const createEnrollmentIntoDB = async (
  enrollmentData: TEnrollment,
  userId: string
) => {
  // Check if course exists
  const course = await Course.findById(enrollmentData.courseId);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check if user already enrolled or has pending enrollment
  const existingEnrollment = await Enrollment.findOne({
    courseId: enrollmentData.courseId,
    studentId: userId,
    isDeleted: false,
  });

  if (existingEnrollment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You already have a ${existingEnrollment.status} enrollment for this course`
    );
  }

  // Create enrollment
  const enrollment = await Enrollment.create({
    ...enrollmentData,
    studentId: userId,
  });

  return enrollment;
};

const getAllEnrollmentsFromDB = async (query: Record<string, unknown>) => {
  const { status, courseId } = query;
  const filter: any = { isDeleted: false };

  if (status) filter.status = status;
  if (courseId) filter.courseId = courseId;

  const enrollments = await Enrollment.find(filter)
    .populate('courseId', 'title courseCategory price salePrice')
    .populate('studentId', 'name email')
    .populate('approvedBy', 'name')
    .sort({ createdAt: -1 });

  return enrollments;
};

const updateEnrollmentStatusIntoDB = async (
  enrollmentId: string,
  status: 'approved' | 'rejected',
  adminId: string,
  rejectionReason?: string
) => {
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Enrollment not found');
  }

  if (enrollment.status !== 'pending') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Only pending enrollments can be updated'
    );
  }

  const updateData: any = {
    status,
    approvedBy: adminId,
    approvalDate: new Date(),
  };

  if (status === 'rejected' && rejectionReason) {
    updateData.rejectionReason = rejectionReason;
  }

  const updatedEnrollment = await Enrollment.findByIdAndUpdate(
    enrollmentId,
    updateData,
    { new: true }
  );

  // If approved, add student to course
  if (status === 'approved') {
    await Course.findByIdAndUpdate(enrollment.courseId, {
      $addToSet: { students: enrollment.studentId },
      $inc: { studentEnrolled: 1 },
    });

    await User.findByIdAndUpdate(enrollment.studentId, {
      $addToSet: { enrolledCourses: enrollment.courseId },
    });
  }

  return updatedEnrollment;
};

export const EnrollmentServices = {
  createEnrollmentIntoDB,
  getAllEnrollmentsFromDB,
  updateEnrollmentStatusIntoDB,
};