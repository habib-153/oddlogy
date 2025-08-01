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

const getUserCoursesFromDB = async (userId: string) => {
  // Find user by ID
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Get user's enrolled courses with enrollment details
  const courses = await Course.aggregate([
    // Match courses where user is enrolled
    {
      $match: {
        students: new Types.ObjectId(userId),
        isDeleted: false,
      },
    },

    // Lookup instructor details
    {
      $lookup: {
        from: 'users',
        localField: 'instructor',
        foreignField: '_id',
        as: 'instructor',
        pipeline: [
          {
            $project: {
              name: 1,
              email: 1,
              profilePhoto: 1,
              designation: 1,
              qualifications: 1,
            },
          },
        ],
      },
    },

    // Lookup modules
    {
      $lookup: {
        from: 'modules',
        localField: 'modules',
        foreignField: '_id',
        as: 'modules',
        pipeline: [
          {
            $match: {
              isDeleted: false,
            },
          },
          {
            $project: {
              name: 1,
              description: 1,
              module_number: 1,
              video_url: 1,
              isCompleted: 1,
              createdAt: 1,
            },
          },
          {
            $sort: { module_number: 1 },
          },
        ],
      },
    },

    // Lookup enrollment details for this specific user
    {
      $lookup: {
        from: 'enrollments',
        let: { courseId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$courseId', '$$courseId'] },
                  { $eq: ['$studentId', new Types.ObjectId(userId)] },
                  { $eq: ['$status', 'approved'] },
                  { $eq: ['$isDeleted', false] },
                ],
              },
            },
          },
          {
            $project: {
              enrollmentDate: 1,
              approvalDate: 1,
              paymentMethod: 1,
              amount: 1,
            },
          },
        ],
        as: 'enrollmentInfo',
      },
    },

    // Add computed fields
    {
      $addFields: {
        instructor: { $arrayElemAt: ['$instructor', 0] },
        moduleCount: { $size: '$modules' },
        enrollmentInfo: { $arrayElemAt: ['$enrollmentInfo', 0] },
        completedModules: {
          $size: {
            $filter: {
              input: '$modules',
              cond: { $eq: ['$$this.isCompleted', true] },
            },
          },
        },
      },
    },

    // Calculate progress percentage
    {
      $addFields: {
        progressPercentage: {
          $cond: {
            if: { $gt: ['$moduleCount', 0] },
            then: {
              $multiply: [
                { $divide: ['$completedModules', '$moduleCount'] },
                100,
              ],
            },
            else: 0,
          },
        },
      },
    },

    // Project final structure
    {
      $project: {
        __v: 0,
        students: 0,
      },
    },

    // Sort by enrollment date (most recent first)
    {
      $sort: { 'enrollmentInfo.enrollmentDate': -1 },
    },
  ]);

  return {
    courses,
    total: courses.length,
    enrolledCoursesCount: courses.length,
  };
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getAllCoursesForHomeFromDB,
  getCourseByIdFromDB,
  updateCourseByIdIntoDB,
  deleteCourseFromDB,
  enrollCourseIntoDB,
  getUserCoursesFromDB,
};