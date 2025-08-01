import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { TUser } from '../User/user.interface';
import { Course } from '../course/course.model';
import { JwtPayload } from 'jsonwebtoken';

const getAllInstructorsFromDB = async () => {
    const instructors = await User.find({ role: 'INSTRUCTOR', isDeleted: false }).select('-password -__v');
    return instructors;
};

const getInstructorByIdFromDB = async (id: string) => {
    const instructor = await User.findById(id).select('-password -__v');
    
    if (!instructor) {
        throw new AppError(httpStatus.NOT_FOUND, 'Instructor not found');
    }
    
    return instructor;
};

const updateInstructorByIdFromDB = async (id: string, payload: Partial<TUser>) => {
    const instructor = await User.findByIdAndUpdate(id, payload, { new: true }).select('-password -__v');
    
    if (!instructor) {
        throw new AppError(httpStatus.NOT_FOUND, 'Instructor not found');
    }
    
    return instructor;
};

const deleteInstructorByIdFromDB = async (id: string) => {
    const instructor = await User.findByIdAndUpdate(id, { isDeleted: true }).select('-password -__v');
    
    if (!instructor) {
        throw new AppError(httpStatus.NOT_FOUND, 'Instructor not found');
    }
    
    return instructor;
};

const getInstructorCourses = async (user: JwtPayload) => {
  // Find instructor by email
  const instructor = await User.findOne({ email: user.email });

  if (!instructor) {
    throw new AppError(httpStatus.NOT_FOUND, 'Instructor not found');
  }

  // Use aggregation to get courses with enrollment data
  const courses = await Course.aggregate([
    // Match courses for this instructor
    {
      $match: {
        instructor: instructor._id,
        isDeleted: false,
      },
    },

    // Lookup instructor details
    {
      $lookup: {
        from: 'users', // collection name for User model
        localField: 'instructor',
        foreignField: '_id',
        as: 'instructor',
        pipeline: [
          {
            $project: {
              name: 1,
              email: 1,
              profilePhoto: 1,
            },
          },
        ],
      },
    },

    // Lookup modules
    {
      $lookup: {
        from: 'modules', // collection name for Module model
        localField: 'modules',
        foreignField: '_id',
        as: 'modules',
        pipeline: [
          {
            $project: {
              name: 1,
              description: 1,
              module_number: 1,
              isCompleted: 1,
              createdAt: 1,
              video_url: 1,
            },
          },
          {
            $sort: { module_number: 1 },
          },
        ],
      },
    },

    // Lookup enrollments to get student details with enrollment dates
    {
      $lookup: {
        from: 'enrollments', // collection name for Enrollment model
        localField: '_id',
        foreignField: 'courseId',
        as: 'enrollments',
        pipeline: [
          {
            $match: {
              status: 'approved', // Only approved enrollments
              isDeleted: false,
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'studentId',
              foreignField: '_id',
              as: 'studentDetails',
              pipeline: [
                {
                  $project: {
                    name: 1,
                    email: 1,
                    profilePhoto: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$studentDetails',
          },
          {
            $project: {
              _id: '$studentDetails._id',
              name: '$studentDetails.name',
              email: '$studentDetails.email',
              profilePhoto: '$studentDetails.profilePhoto',
              enrollmentDate: '$enrollmentDate',
              approvalDate: '$approvalDate',
              paymentMethod: '$paymentMethod',
              amount: '$amount',
              status: '$status',
            },
          },
        ],
      },
    },

    // Add computed fields
    {
      $addFields: {
        instructor: { $arrayElemAt: ['$instructor', 0] },
        students: '$enrollments', 
        studentEnrolled: { $size: '$enrollments' },
        moduleCount: { $size: '$modules' },
      },
    },

    // Remove unwanted fields
    {
      $project: {
        __v: 0,
        enrollments: 0, 
      },
    },

    // Sort by creation date (newest first)
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return {
    courses,
    total: courses.length,
  };
};

export const InstructorServices = {
    getAllInstructorsFromDB,
    getInstructorByIdFromDB,
    updateInstructorByIdFromDB,
    deleteInstructorByIdFromDB,
    getInstructorCourses,
};
