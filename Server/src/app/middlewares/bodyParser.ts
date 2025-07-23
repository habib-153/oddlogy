/* eslint-disable no-unused-vars */
import AppError from '../errors/AppError';
import { catchAsync } from '../utils/catchAsync';

export const parseBody = catchAsync(async (req, res, next) => {
  try {
    // If body has a 'data' field, parse it
    if (req.body.data) {
      if (typeof req.body.data === 'string') {
        req.body = {
          ...req.body,
          ...JSON.parse(req.body.data)
        };
        delete req.body.data;
      }
    }
    // If no 'data' field but body exists, use it as is
    next();
  } catch (error) {
    throw new AppError(400, 'Invalid JSON in data field');
  }
});
