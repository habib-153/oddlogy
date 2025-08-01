import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { InstructorControllers } from './instructor.controller';

const router = express.Router();

router.get('/', InstructorControllers.getAllInstructor);

router.get(
  '/:id',
  //  auth('ADMIN', 'INSTRUCTOR'),
  InstructorControllers.getInstructorById
);

router.patch('/:id', auth('ADMIN'), InstructorControllers.updateInstructorById);

router.delete(
  '/:id',
  auth('ADMIN'),
  InstructorControllers.deleteInstructorById
);

router.get(
  '/my-courses',
  auth(USER_ROLE.INSTRUCTOR),
  InstructorControllers.getInstructorCourses
);

export const InstructorRoutes = router;
