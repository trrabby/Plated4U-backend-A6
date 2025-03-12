import express from 'express';
import { orderController } from './order.controller';
import validateRequest from '../../MiddleWares/validateRequest';
import auth from '../../MiddleWares/auth';
import { USER_ROLE } from '../users/user.constant';
import {
  orderValidationSchema,
  updateOrderValidationSchema,
} from './order.validation';

const router = express.Router();

router.post(
  '/order-meal',
  auth(USER_ROLE.admin, USER_ROLE.mealProvider, USER_ROLE.customer),
  validateRequest(orderValidationSchema),
  orderController.orderCreateFun,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.mealProvider, USER_ROLE.customer),
  orderController.getAllOrdersFun,
);

router.get(
  '/my-orders',
  auth(USER_ROLE.admin, USER_ROLE.mealProvider, USER_ROLE.customer),
  orderController.getMyOrdersFun,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.mealProvider),
  validateRequest(updateOrderValidationSchema),
  orderController.updateAnOrderFun,
);

router.get(
  '/revenue',
  auth(USER_ROLE.admin),
  orderController.getTotalRevenueFun,
);

router.get(
  '/:orderId',
  auth(USER_ROLE.admin, USER_ROLE.mealProvider),
  orderController.getAnOrderFun,
);

export const orderRoute = router;
