"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureImages = void 0;
const mongoose_1 = require("mongoose");
const featureImagesSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    img_url: {
        type: String,
        required: true,
    },
});
exports.FeatureImages = (0, mongoose_1.model)("FeatureImages", featureImagesSchema);
