import { model, Schema } from "mongoose";
import { TFeatureImages } from "./carousel.interface";

const featureImagesSchema = new Schema<TFeatureImages>({
    name: {
        type: String,
        required: true,
    },
    img_url: {
        type: String,
        required: true,
    },
})

export const FeatureImages = model<TFeatureImages>("FeatureImages", featureImagesSchema);