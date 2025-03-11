import express from 'express';

import auth from '../../MiddleWares/auth';
import { USER_ROLE } from '../users/user.constant';
import { multerUpload } from '../../config/multer.config';
import { cMealController } from './cMeal.controller';

const router = express.Router();

router.post(
  '/add-meal',
  multerUpload.array('files', 5),
  auth(USER_ROLE.admin),
  cMealController.cMealCreateFun,
);

router.get('/', cMealController.getAllMealFun);

// router.patch(
//   '/:id',
//   multerUpload.array('files', 5),
//   auth(USER_ROLE.admin),
//   carController.updateACarFun,
// );

// router.put(
//   '/delete-car/:id',
//   auth(USER_ROLE.admin, USER_ROLE.user),
//   carController.deleteACarFun,
// );

// router.get(
//   '/:id',
//   auth(USER_ROLE.admin, USER_ROLE.user),
//   carController.getACarFun,
// );

export const cMealRoutes = router;
