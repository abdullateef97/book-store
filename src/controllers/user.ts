import { RequestHandler } from 'express';
import { CreateUserInterface, GetUsersListInterface, LoginUserType } from '../interfaces/user';
import * as utils from '../utils';
import * as responseManager from '../utils/responseManager';
import * as userService from '../services/user';
import { validateCreateUserSchema, validateGetUserListSchema, validateLoginUserSchema } from '../validations/user';
import log from '../config/logger';

export const createUser: RequestHandler = async (req, res) => {
  try {
    const data: CreateUserInterface = await utils.joiValidate(req.body, validateCreateUserSchema);
    const response = await userService.createUser(data);
    responseManager.successResponseConstructor(res, response);
  } catch (error: any) {
    log.error('error creating user');
    log.error(error);
    return responseManager.errorResponseConstructor(res, error);
  }
};

export const loginUser: RequestHandler = async (req, res) => {
  try {
    const data: LoginUserType = await utils.joiValidate(req.body, validateLoginUserSchema);
    const response = await userService.loginUser(data);
    responseManager.successResponseConstructor(res, response);
  } catch (error) {
    log.error('error creating user');
    log.error(error);
    return responseManager.errorResponseConstructor(res, error);
  }
};

export const getUserDetails: RequestHandler = async (req, res) => {
  const user = res.locals.user;
  try {
    const response = await userService.getUserDetails(user.user_id);
    responseManager.successResponseConstructor(res, response);
  } catch (error) {
    log.error('error getting user details');
    log.error(error);
    return responseManager.errorResponseConstructor(res, error);
  }
};

export const getUserList: RequestHandler = async (req, res) => {
  try {
    const data: GetUsersListInterface = await utils.joiValidate(req.query, validateGetUserListSchema);
    const response = await userService.getUsersList(data);
    responseManager.successResponseConstructor(res, response);
  } catch (error) {
    log.error('error fetching users list');
    log.error(error);
    return responseManager.errorResponseConstructor(res, error);
  }
};