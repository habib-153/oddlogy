import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { InstructorServices } from "./instructor.service";

const getAllInstructor = catchAsync(async (req, res) => {
    const instructors = await InstructorServices.getAllInstructorsFromDB()

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Instructors Retrieved Successfully",
        data: instructors,
    });
})

const getInstructorById = catchAsync(async (req, res) => {
    const { id } = req.params
    const instructor = await InstructorServices.getInstructorByIdFromDB(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Instructor Retrieved Successfully",
        data: instructor,
    });
})

const updateInstructorById = catchAsync(async (req, res) => {
    const { id } = req.params
    const instructor = await InstructorServices.updateInstructorByIdFromDB(id, req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Instructor Updated Successfully",
        data: instructor,
    });
})

const deleteInstructorById = catchAsync(async (req, res) => {
    const { id } = req.params
    const instructor = await InstructorServices.deleteInstructorByIdFromDB(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Instructor Deleted Successfully",
        data: instructor,
    });
})

export const InstructorControllers = {
    getAllInstructor,
    getInstructorById,
    updateInstructorById,
    deleteInstructorById
}