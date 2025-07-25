"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarouselRoutes = void 0;
const express_1 = __importDefault(require("express"));
const carousel_controller_1 = require("./carousel.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
router.get('/', carousel_controller_1.CarouselControllers.getAllImages);
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), multer_config_1.multerUpload.single('image'), carousel_controller_1.CarouselControllers.createFeatureImage);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), carousel_controller_1.CarouselControllers.deleteFeatureImage);
exports.CarouselRoutes = router;
