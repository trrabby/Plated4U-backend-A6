/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status';

import { NextFunction, Request, RequestHandler, Response } from 'express';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API Not Found !!',
    error: '',
  });
  return;
};

export default notFound;
