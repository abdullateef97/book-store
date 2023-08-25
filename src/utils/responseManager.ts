import { Response } from 'express';
import { responseConstructor } from '.';
import httpStatus from 'http-status';

export const errorResponseConstructor = (res: Response, error: any) => {
  return responseConstructor(res, {
    code: error.code || httpStatus.INTERNAL_SERVER_ERROR,
    message: error.message || 'Something went wrong, please contact us',
    data: error.data,
  });
};

export const successResponseConstructor = (res: Response, data: any, message?: string) => {
  return responseConstructor(res, {
    code: httpStatus.OK,
    message: message || 'Request was successful',
    data,
  });
};

export const badRequestConstructor =  (message?: string): any => {
  return {
    code: httpStatus.BAD_REQUEST,
    message: message || 'Bad request',
  };
};

export const unAuthorizedConstructor =  (message?: string): any => {
  return {
    code: httpStatus.UNAUTHORIZED,
    message: message || 'Unauthorized request',
  };
};
