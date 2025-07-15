import express from 'express';
import { CarouselControllers } from './carousel.controller';

const router = express.Router()

router.get('/', CarouselControllers.getAllImages)
router.post('/', CarouselControllers.createFeatureImage)
router.delete('/:id', CarouselControllers.deleteFeatureImage)

export const CarouselRoutes = router