import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const courses = await CourseServices.getAllCoursesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses retrieved successfully',
    data: courses,
  });
});

const getAllCoursesForHome = catchAsync(async (req, res) => {
  const courses = await CourseServices.getAllCoursesForHomeFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses retrieved successfully',
    data: courses,
  });
});

const getCourseById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const course = await CourseServices.getCourseByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course retrieved successfully',
    data: course,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.updateCourseByIdIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  await CourseServices.deleteCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course deleted successfully',
    data: null,
  });
});

const enrollCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  const result = await CourseServices.enrollCourseIntoDB(courseId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully enrolled in course',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCoursesForHome,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse,
};