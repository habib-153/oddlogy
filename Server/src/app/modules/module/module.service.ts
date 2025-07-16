import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TModule } from './module.interface';
import { Module } from './module.model';
import { Types } from 'mongoose';
import { Course } from '../course/course.model';

//  need to modify when create push on course object
const createModuleIntoDB = async (payload: TModule) => {
  const course = await Course.findById(payload.course);

  if (!course) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check if the module number is unique within the course
  const existingModule = await Module.findOne({
    course: payload.course,
    module_number: payload.module_number,
  });

  if (existingModule) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Module number must be unique within the course'
    );
  }

  const result = await Module.create(payload);
  if (!result) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Module creation failed');
  }
  
  course.modules.push(result._id);
  await course.save();
  
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