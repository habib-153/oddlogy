import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';
import { TImageFiles } from '../../interfaces/image.interface';

const createCourse = catchAsync(async (req, res) => {
  const files = req.files as TImageFiles
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

  const result = await CourseServices.createCourseIntoDB(courseData);

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
  const files = req.files as TImageFiles
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

  const result = await CourseServices.updateCourseByIdIntoDB(id, updateData);

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