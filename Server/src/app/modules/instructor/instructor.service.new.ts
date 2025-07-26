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

    // Find courses where this instructor is assigned
    const courses = await Course.find({ 
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
};

export const InstructorServices = {
    getAllInstructorsFromDB,
    getInstructorByIdFromDB,
    updateInstructorByIdFromDB,
    deleteInstructorByIdFromDB,
    getInstructorCourses,
};
