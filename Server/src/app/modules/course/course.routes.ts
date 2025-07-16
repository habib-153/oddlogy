import express from 'express';
import { CourseControllers } from './course.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/',
  // auth(USER_ROLE.ADMIN, USER_ROLE.INSTRUCTOR),
  CourseControllers.createCourse
);

router.get('/', CourseControllers.getAllCourses);
router.get('/home', CourseControllers.getAllCoursesForHome);


router.get('/:id', CourseControllers.getCourseById);

router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.INSTRUCTOR),
  CourseControllers.updateCourse
);

router.delete('/:id', auth(USER_ROLE.ADMIN), CourseControllers.deleteCourse);

router.post(
  '/enroll/:courseId',
  auth(USER_ROLE.USER),
  CourseControllers.enrollCourse
);

export const CourseRoutes = router;