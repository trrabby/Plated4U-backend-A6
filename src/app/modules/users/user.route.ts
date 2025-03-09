import express from 'express';

import { UserControllers } from './user.controller';
import auth from '../../MiddleWares/auth';
import { USER_ROLE } from './user.constant';
import { multerUpload } from '../../config/multer.config';
import validateRequest from '../../MiddleWares/validateRequest';
import { UserValidation } from './user.validation';
import validateRequestFormdata from '../../MiddleWares/validateRequestFormdata';

const router = express.Router();

router.post(
  '/register',
  multerUpload.single('file'),
  validateRequestFormdata(UserValidation.userValidationSchema),
  UserControllers.registerUser,
);

router.get('/', auth(USER_ROLE.admin), UserControllers.AllUsers);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(UserValidation.userUpdateValidationSchema),
  UserControllers.updateAUserFun,
);

router.patch(
  '/deleteUser/:id',
  auth(USER_ROLE.admin),
  UserControllers.deleteAUserFun,
);
export const UserRoutes = router;
