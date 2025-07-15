import express from 'express';
import { InstructorControllers } from './instructor.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', InstructorControllers.getAllInstructor)
router.get('/:id', auth('ADMIN', 'INSTRUCTOR'), InstructorControllers.getInstructorById)
router.patch('/:id', auth('ADMIN'), InstructorControllers.updateInstructorById)
router.delete('/:id', auth('ADMIN'), InstructorControllers.deleteInstructorById)

export const InstructorRoutes = router