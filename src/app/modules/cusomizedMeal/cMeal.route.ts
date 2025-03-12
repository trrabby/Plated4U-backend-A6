import express from 'express';

import auth from '../../MiddleWares/auth';
import { USER_ROLE } from '../users/user.constant';
import { multerUpload } from '../../config/multer.config';
import { cMealController } from './cMeal.controller';

const router = express.Router();

router.post(
  '/add-meal',
  multerUpload.array('files', 5),
  auth(USER_ROLE.admin, USER_ROLE.mealProvider),
  cMealController.cMealCreateFun,
);

router.get('/', cMealController.getAllMealFun);

router.patch(
  '/:id',
  multerUpload.array('files', 5),
  auth(USER_ROLE.admin, USER_ROLE.mealProvider),
  cMealController.updateMealFun,
);

router.patch(
  '/delete-car/:id',
  auth(USER_ROLE.admin, USER_ROLE.mealProvider),
  cMealController.deleteAMealFun,
);

router.get('/:id', cMealController.getMealFun);

export const cMealRoutes = router;
