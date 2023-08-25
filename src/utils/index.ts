import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import httpStatus from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import config from '../config/config';
import { unAuthorizedConstructor } from './responseManager';

export const generateJWTToken = (data: { [key: string]: any }): string => {
  return jwt.sign(data, config.jwt.accessToken);
};

export const decodeJWTToken = (token: string): any => {
  try {
    const payload =  jwt.verify(token, config.jwt.accessToken);
    return payload;
  } catch (error) {
    throw unAuthorizedConstructor();
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateUserId = () : string => {
  return uuidv4();
};

const getErrMessage = (item: Joi.ValidationErrorItem): string | undefined => {
  let message;
  switch (item.type) {
    case `${item.type.split('.')[0]}.only`:
      message = `${item?.context?.value} is not a valid option`;
      break;
    case `${item.type.split('.')[0]}.required`:
      message = `${item.path.join('.')} is required`;
      break;
    case 'object.min':
      message = 'This request body should not be empty';
      break;
    case 'string.min':
      message = `${item.path.join('.')} should have at least ${item?.context?.limit} characters!`;
      break;
    case 'string.max':
      message = `${item.path.join('.')} should have at most ${item?.context?.limit} characters!`;
      break;
    case 'string.alphanum':
      message = `${item.path.join('.')} should contain only alphanumeric characters`;
      break;
    case 'string.base':
      message = `${item.path.join('.')} should be a string`;
      break;
    case 'string.length':
      message = `${item.path.join('.')} should only be ${item?.context?.limit} characters, no less, no more`;
      break;
    default:
      break;
  }
  return message;
};

interface RespInterface {
  code: number;
  message?: string;
  data?: { [key: string]: any }
}

export const createResponseObject = (code: number, message: string, data?: any): RespInterface => {
  return {
    code,
    message,
    data,
  };
};

export const responseConstructor = (res: Response, data: RespInterface) => {
  res.status(data.code);
  res.json(data);
};

export const joiValidate = (data: any, schema: Joi.ObjectSchema<any>): Promise<any> => {
  const { error, value } = schema.validate(data, { errors: { escapeHtml: false }, abortEarly: false, allowUnknown: false });

  return new Promise((resolve, reject): void => {
    const buildErrorObject = (errors: Joi.ValidationErrorItem[]): { message: string; customErrorMessage: string } | { [key: string]: any } => {
      const customErrors: any = {};
      errors.forEach((item) => {
        if (!Object.prototype.hasOwnProperty.call(customErrors, item.path.join('.'))) {
          const customErrorMessage = getErrMessage(item);

          customErrors[item.path.join('.')] = {
            message: item.message.replace(/['"]+/g, ''),
            customErrorMessage,
          };
        }
      });

      return customErrors;
    };

    if (error) {
      const errorData = buildErrorObject(error.details);
      const errorObj = createResponseObject(httpStatus.BAD_REQUEST, 'invalid request data', errorData);

      return reject(errorObj);
    }

    return resolve(value);
  });
};