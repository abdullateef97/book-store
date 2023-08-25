import { RequestHandler } from 'express';
import { decodeJWTToken, responseConstructor } from '.';
import httpStatus from 'http-status';
import models from '../models';
import config from '../config/config';
import log from '../config/logger';
import * as responseManager from '../utils/responseManager';

export const authenticateClient = (): RequestHandler => async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return responseConstructor(res, {
        code: httpStatus.UNAUTHORIZED,
        message: 'Unauthorized request',
      });
    }
  
    const tokenPayload = decodeJWTToken(token);
    const user = await models.users.findOne({
      where: {
        user_id: tokenPayload.user_id,
        active: true,
      },
      attributes: ['id', 'user_id'],
    });
  
    if (!user) {
      return responseConstructor(res, {
        code: httpStatus.UNAUTHORIZED,
        message: 'Unauthorized request',
      });
    }
    res.locals.user = {
      user_id: user.user_id,
      id: user.id,
    };
    return next();
  } catch (error) {
    log.error('error authenticating user');
    return responseManager.errorResponseConstructor(res, error);
  }
};

export const authenticateAdmin = () : RequestHandler => (req, res, next) => {
  const secretKey = req.headers['x-access-token'];
  if (secretKey !== config.adminSecretKey) {
    return responseConstructor(res, {
      code: httpStatus.UNAUTHORIZED,
      message: 'Unauthorized request',
    });
  }
  return next();
};