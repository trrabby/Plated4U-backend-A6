import { Router } from 'express';
import { UserRoutes } from '../modules/users/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { orderRoute } from '../modules/order/order.route';
import { paymentRoute } from '../modules/payments/payment.route';
import { cMealRoutes } from '../modules/cusomizedMeal/cMeal.route';

const router = Router();

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
    path: '/meals',
    route: cMealRoutes,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
  {
    path: '/payments',
    route: paymentRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
