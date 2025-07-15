"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarouselRoutes = void 0;
const express_1 = __importDefault(require("express"));
const carousel_controller_1 = require("./carousel.controller");
const router = express_1.default.Router();
router.get('/', carousel_controller_1.CarouselControllers.getAllImages);
router.post('/', carousel_controller_1.CarouselControllers.createFeatureImage);
router.delete('/:id', carousel_controller_1.CarouselControllers.deleteFeatureImage);
exports.CarouselRoutes = router;
