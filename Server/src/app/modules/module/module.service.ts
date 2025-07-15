import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TModule } from './module.interface';
import { Module } from './module.model';
import { Types } from 'mongoose';

//  need to modify when create push on course object
const createModuleIntoDB = async (payload: TModule) => {
  const result = await Module.create(payload);
  return result;
};

const getAllModulesFromDB = async () => {
  const modules = await Module.find({ isDeleted: false }).populate('course');
  return modules;
};

const getModuleByIdFromDB = async (id: string) => {
  const module = await Module.findById(id).populate('course');

  if (!module) {
    throw new AppError(httpStatus.NOT_FOUND, 'Module not found');
  }

  return module;
};

const updateModuleByIdIntoDB = async (
  id: string,
  payload: Partial<TModule>
) => {
  const module = await Module.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate('course');

  if (!module) {
    throw new AppError(httpStatus.NOT_FOUND, 'Module not found');
  }

  return module;
};

const deleteModuleFromDB = async (id: string) => {
  const module = await Module.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!module) {
    throw new AppError(httpStatus.NOT_FOUND, 'Module not found');
  }

  return module;
};

const getModulesByCourseId = async (courseId: string) => {
  const modules = await Module.find({
    course: new Types.ObjectId(courseId),
    isDeleted: false,
  }).sort({ module_number: 1 });

  return modules;
};

export const ModuleServices = {
  createModuleIntoDB,
  getAllModulesFromDB,
  getModuleByIdFromDB,
  updateModuleByIdIntoDB,
  deleteModuleFromDB,
  getModulesByCourseId,
};