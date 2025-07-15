"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const module_model_1 = require("./module.model");
const mongoose_1 = require("mongoose");
const createModuleIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield module_model_1.Module.create(payload);
    return result;
});
const getAllModulesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const modules = yield module_model_1.Module.find({ isDeleted: false }).populate('course');
    return modules;
});
const getModuleByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const module = yield module_model_1.Module.findById(id).populate('course');
    if (!module) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Module not found');
    }
    return module;
});
const updateModuleByIdIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const module = yield module_model_1.Module.findByIdAndUpdate(id, payload, {
        new: true,
    }).populate('course');
    if (!module) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Module not found');
    }
    return module;
});
const deleteModuleFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const module = yield module_model_1.Module.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!module) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Module not found');
    }
    return module;
});
const getModulesByCourseId = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const modules = yield module_model_1.Module.find({
        course: new mongoose_1.Types.ObjectId(courseId),
        isDeleted: false,
    }).sort({ module_number: 1 });
    return modules;
});
exports.ModuleServices = {
    createModuleIntoDB,
    getAllModulesFromDB,
    getModuleByIdFromDB,
    updateModuleByIdIntoDB,
    deleteModuleFromDB,
    getModulesByCourseId,
};
