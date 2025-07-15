import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Module } from '../module/module.model';
import { TCourse } from './course.interface';
import { Course } from './course.model';
import { Types } from 'mongoose';
import { User } from '../User/user.model';
import { QueryBuilder } from '../../builder/QueryBuilder';

const CourseSearchableFields = ['title', 'description', 'courseType'];

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesForHomeFromDB = async () => {
  const result = await Course.find({ isDeleted: false })
    .select('-modules -students') 
    .populate({
      path: 'instructor',
      select: 'name profilePhoto', 
    });

  return result
};


const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQueryBuilder = new QueryBuilder(
    Course.find({ isDeleted: false }),
    query
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQueryBuilder.modelQuery
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

  const meta = await courseQueryBuilder.countTotal();

  return { result, meta };
};

const getCourseByIdFromDB = async (id: string) => {
  const course = await Course.findById(id)
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
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  return course;
};

const updateCourseByIdIntoDB = async (
  id: string,
  payload: Partial<TCourse>
) => {
  const existingCourse = await Course.findById(id);
  if (!existingCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  const { media, prerequisites, ...otherFields } = payload;

  const updateData: Record<string, unknown> = { ...otherFields };

  if (media) {
    Object.keys(media).forEach((key) => {
      updateData[`media.${key}`] = media[key as keyof typeof media];
    });
  }

  if (prerequisites) {
    updateData.prerequisites = prerequisites;
  }

  const course = await Course.findByIdAndUpdate(id, updateData, {
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
};

const deleteCourseFromDB = async (id: string) => {
  const course = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Also mark all related modules as deleted
  await Module.updateMany(
    { course: new Types.ObjectId(id) },
    { isDeleted: true }
  );

  return course;
};

const enrollCourseIntoDB = async (courseId: string, userId: string) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if user is already enrolled in the course
  const isEnrolled = course.students.includes(new Types.ObjectId(userId));
  if (isEnrolled) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User already enrolled in this course'
    );
  }

  // Use transactions to ensure both operations succeed or fail together
  const session = await Course.startSession();
  try {
    session.startTransaction();

    // Update the course document
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $addToSet: { students: userId },
        $inc: { studentEnrolled: 1 },
      },
      { new: true, session }
    );

    // Update the user document
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { enrolledCourses: courseId },
      },
      { session }
    );

    await session.commitTransaction();

    return updatedCourse;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getAllCoursesForHomeFromDB,
  getCourseByIdFromDB,
  updateCourseByIdIntoDB,
  deleteCourseFromDB,
  enrollCourseIntoDB,
};