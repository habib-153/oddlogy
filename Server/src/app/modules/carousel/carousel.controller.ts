import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CarouselServices } from "./carousel.service";

const getAllImages = catchAsync(async (req, res) => {
    const images = await CarouselServices.getFeatureImagesFromDB()

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Images Retrieved Successfully",
        data: images,
    });
})

const createFeatureImage = catchAsync(async (req, res) => {
    const result = await CarouselServices.createFeatureImagesIntoDB(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Banner Created Successfully",
        data: result,
    });
})

const deleteFeatureImage = catchAsync(async (req, res) => {
    const { id } = req.params
    await CarouselServices.deleteFeatureImagesFromDB(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Image Deleted Successfully",
        data: null,
    });
})

export const CarouselControllers = {
    getAllImages,
    createFeatureImage,
    deleteFeatureImage
}