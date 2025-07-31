import express from 'express';
import { EnrollmentControllers } from './enrollment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.USER, USER_ROLE.INSTRUCTOR, USER_ROLE.ADMIN),
  EnrollmentControllers.createEnrollment
);

router.get('/', auth(USER_ROLE.ADMIN), EnrollmentControllers.getAllEnrollments);

router.patch(
  '/:enrollmentId/status',
  auth(USER_ROLE.ADMIN),
  EnrollmentControllers.updateEnrollmentStatus
);

export const EnrollmentRoutes = router;