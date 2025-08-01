import express from 'express';
import { CourseControllers } from './course.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParser';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.INSTRUCTOR),
  multerUpload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  parseBody,
  CourseControllers.createCourse
);

router.get('/', CourseControllers.getAllCourses);
router.get('/home', CourseControllers.getAllCoursesForHome);

router.get('/:id', CourseControllers.getCourseById);

router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.INSTRUCTOR),
  multerUpload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  parseBody,
  CourseControllers.updateCourse
);

router.delete('/:id', auth(USER_ROLE.ADMIN), CourseControllers.deleteCourse);
router.get('/user/:userId', CourseControllers.getUserCourses);

router.post(
  '/enroll/:courseId',
  auth(USER_ROLE.USER),
  CourseControllers.enrollCourse
);

export const CourseRoutes = router;