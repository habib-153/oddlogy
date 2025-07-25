import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CarouselServices } from "./carousel.service";
import { TImageFile } from "../../interfaces/image.interface";

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
  const file = req.file as TImageFile;
  const { name } = req.body;

  if (!file) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Image file is required',
        data: null,
    });
  }

  const imageData = {
    name,
    img_url: file.path, 
  };

  const result = await CarouselServices.createFeatureImagesIntoDB(imageData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Feature image created successfully',
    data: result,
  });
});

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