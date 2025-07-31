import httpStatus from "http-status"
import AppError from "../../errors/AppError"
import { User } from "../User/user.model"
import { TUser } from "../User/user.interface"

const getAllInstructorsFromDB = async () => {
    const instructors = await User.find({ role: 'INSTRUCTOR', isDeleted: false }).select('-password -__v')

    return instructors
}

const getInstructorByIdFromDB = async (id: string) => {
    const instructor = await User.findById(id).select('-password -__v')

    if(!instructor) throw new AppError(httpStatus.NOT_FOUND, 'Instructor not found');

    return instructor
}

const updateInstructorByIdFromDB = async (id: string, payload: Partial<TUser>) => {
    const instructor = await User.findByIdAndUpdate(id, payload, { new: true }).select('-password -__v')

    if(!instructor) throw new AppError(httpStatus.NOT_FOUND, 'Instructor not found');

    return instructor
}

const deleteInstructorByIdFromDB = async (id: string) => {
    const instructor = await User.findByIdAndUpdate(id, {isDeleted: true}).select('-password -__v')

    if(!instructor) throw new AppError(httpStatus.NOT_FOUND, 'Instructor not found');

    return instructor
}

export const InstructorServices = {
    getAllInstructorsFromDB,
    getInstructorByIdFromDB,
    updateInstructorByIdFromDB,
    deleteInstructorByIdFromDB
}