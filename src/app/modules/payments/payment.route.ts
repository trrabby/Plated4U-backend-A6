import express from 'express';
import {
  initPayment,
  paymentFailed,
  PaymentController,
  paymentSuccess,
} from './payment.controller';
import auth from '../../MiddleWares/auth';
import { USER_ROLE } from '../users/user.constant';

const router = express.Router();

router.post('/init', initPayment); // Start payment
router.post('/success/:id', paymentSuccess); // Handle success response from SSLCOMMERZ
router.post('/fail/:id', paymentFailed);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.mealProvider),
  PaymentController.getAllpaymentsFun,
);

router.get(
  '/my-payments',
  auth(USER_ROLE.admin, USER_ROLE.mealProvider, USER_ROLE.customer),
  PaymentController.getMyPaymentsFun,
);

router.get(
  '/:tran_id',
  auth(USER_ROLE.admin, USER_ROLE.mealProvider),
  PaymentController.getAPaymentFun,
);

export const paymentRoute = router;
