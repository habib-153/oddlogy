import express from 'express';
import { CarouselControllers } from './carousel.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

router.get('/', CarouselControllers.getAllImages);

router.post(
  '/',
  auth(USER_ROLE.ADMIN),
  multerUpload.single('image'),
  CarouselControllers.createFeatureImage
);

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  CarouselControllers.deleteFeatureImage
);

export const CarouselRoutes = router;