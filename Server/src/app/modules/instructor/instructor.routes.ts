import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { InstructorControllers } from './instructor.controller';

const router = express.Router();

router.get(
  '/my-courses',
  auth(USER_ROLE.INSTRUCTOR),
  InstructorControllers.getInstructorCourses
);

export const InstructorRoutes = router;
