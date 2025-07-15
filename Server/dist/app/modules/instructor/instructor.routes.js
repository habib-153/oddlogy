"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const instructor_controller_1 = require("./instructor.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get('/', instructor_controller_1.InstructorControllers.getAllInstructor);
router.get('/:id', (0, auth_1.default)('ADMIN', 'INSTRUCTOR'), instructor_controller_1.InstructorControllers.getInstructorById);
router.patch('/:id', (0, auth_1.default)('ADMIN'), instructor_controller_1.InstructorControllers.updateInstructorById);
router.delete('/:id', (0, auth_1.default)('ADMIN'), instructor_controller_1.InstructorControllers.deleteInstructorById);
exports.InstructorRoutes = router;
