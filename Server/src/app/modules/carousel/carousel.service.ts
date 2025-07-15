import { TFeatureImages } from "./carousel.interface";
import { FeatureImages } from "./carousel.model";

const getFeatureImagesFromDB = async () => {
  const result = await FeatureImages.find()

  return result;
};

const createFeatureImagesIntoDB = async (payload: TFeatureImages) => {
  const result = await FeatureImages.create(payload)

  return result;
}

const deleteFeatureImagesFromDB = async (id: string) => {
  const result = await FeatureImages.findByIdAndDelete(id)

  return result;
}

export const CarouselServices = {
    getFeatureImagesFromDB,
    createFeatureImagesIntoDB,
    deleteFeatureImagesFromDB,
}