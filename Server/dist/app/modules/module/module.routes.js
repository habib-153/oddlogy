"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const module_controller_1 = require("./module.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), module_controller_1.ModuleControllers.createModule);
router.get('/', module_controller_1.ModuleControllers.getAllModules);
router.get('/course/:courseId', module_controller_1.ModuleControllers.getModulesByCourse);
router.get('/:id', module_controller_1.ModuleControllers.getModuleById);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), module_controller_1.ModuleControllers.updateModule);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), module_controller_1.ModuleControllers.deleteModule);
exports.ModuleRoutes = router;
