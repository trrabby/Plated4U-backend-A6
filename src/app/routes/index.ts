import { Router } from 'express';
import { UserRoutes } from '../modules/users/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { carRoutes } from '../modules/car/car.route';
import { orderRoute } from '../modules/order/order.route';
import { paymentRoute } from '../modules/payments/payment.route';

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
    path: '/cars',
    route: carRoutes,
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
