import express from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { ProfileRoutes } from '../modules/Profile/profile.route';
import { CarouselRoutes } from '../modules/carousel/carousel.route';
import { InstructorRoutes } from '../modules/instructor/instructor.routes';
import { ModuleRoutes } from '../modules/module/module.routes';
import { CourseRoutes } from '../modules/course/course.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },
  {
    path: 'feature-image',
    route: CarouselRoutes,
  },
  {
    path: '/instructors',
    route: InstructorRoutes,
  },
  {
    path: '/modules',
    route: ModuleRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
