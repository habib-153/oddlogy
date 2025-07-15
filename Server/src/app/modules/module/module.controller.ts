import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ModuleServices } from './module.service';

const createModule = catchAsync(async (req, res) => {
  const result = await ModuleServices.createModuleIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Module created successfully',
    data: result,
  });
});

const getAllModules = catchAsync(async (req, res) => {
  const modules = await ModuleServices.getAllModulesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Modules retrieved successfully',
    data: modules,
  });
});

const getModuleById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const module = await ModuleServices.getModuleByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Module retrieved successfully',
    data: module,
  });
});

const updateModule = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ModuleServices.updateModuleByIdIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Module updated successfully',
    data: result,
  });
});

const deleteModule = catchAsync(async (req, res) => {
  const { id } = req.params;
  await ModuleServices.deleteModuleFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Module deleted successfully',
    data: null,
  });
});

const getModulesByCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const modules = await ModuleServices.getModulesByCourseId(courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Modules retrieved successfully',
    data: modules,
  });
});

export const ModuleControllers = {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
  getModulesByCourse,
};