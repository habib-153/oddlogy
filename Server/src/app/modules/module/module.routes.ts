import express from 'express';
import { ModuleControllers } from './module.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post('/', auth(USER_ROLE.ADMIN), ModuleControllers.createModule);
router.get('/', ModuleControllers.getAllModules);
router.get('/course/:courseId', ModuleControllers.getModulesByCourse);
router.get('/:id', ModuleControllers.getModuleById);
router.patch('/:id', auth(USER_ROLE.ADMIN), ModuleControllers.updateModule);
router.delete('/:id', auth(USER_ROLE.ADMIN), ModuleControllers.deleteModule);

export const ModuleRoutes = router;