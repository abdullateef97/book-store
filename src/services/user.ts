import { Op } from 'sequelize';
import { CreateUserInterface, GetUsersListInterface, LoginUserType, UserInterface } from '../interfaces/user';
import models from '../models';
import * as utils from '../utils';
import * as responseManager from '../utils/responseManager';

export const createUser = async (data: CreateUserInterface): Promise<{ [key: string]: any }> => {
  const existingUser = await models.users.findOne({
    where: {
      email: data.email,
    },
  });
  if (existingUser) {
    throw responseManager.badRequestConstructor('Please use another email, email already in use');
  }
  const hashedPassword = await utils.hashPassword(data.password);
  const userId = utils.generateUserId();

  await models.users.create({
    ...data,
    password: hashedPassword,
    user_id: userId,
  });

  const accessToken = utils.generateJWTToken({
    user_id: userId,
  });
  return {
    access_token: accessToken,
    user: {
      email: data.email,
      last_name: data.last_name,
      first_name: data.first_name,
      user_id: userId,
    },
  };
};

export const loginUser = async (data: LoginUserType): Promise<{ [key: string]: any }> => {
  const user: UserInterface = await models.users.findOne({
    where: { email: data.email },
  });

  if (!user) {
    throw responseManager.badRequestConstructor('Email or Password Invalid');
  }

  const validPassword = await utils.comparePassword(data.password, user.password);
  if (!validPassword) {
    throw responseManager.badRequestConstructor('Email or Password Invalid');
  }

  const accessToken = utils.generateJWTToken({
    user_id: user.user_id,
  });

  return {
    access_token: accessToken,
    user: {
      email: user.email,
      last_name: user.last_name,
      first_name: user.first_name,
      user_id: user.user_id,
    },
  };
};

export const getUserDetails = async (userId: string): Promise<UserInterface> => {
  const attributesToExclude = ['password', 'id'];
  const user = await models.users.findOne({
    where: { user_id: userId },
    attributes: { exclude: attributesToExclude },
  });

  if (!user) {
    throw responseManager.badRequestConstructor('Email or Password Invalid');
  }
  return user;
};

export const getUsersList = async (data: GetUsersListInterface): Promise<UserInterface[]> => {
  const attributesToExclude = ['password', 'id'];
  const users = await models.users.findAll({
    where: {
      [models.Sequelize.Op.and]: [
        ...(data.user_id ? [{ user_id: data.user_id }] : []),
        ...(data.email ? [{ email: data.email }] : []),
        ...(data.active !== undefined ? [{ active: data.active }] : []),
        ...(data.dateFrom ? [{
          createdAt: {
            [Op.gte]: data.dateFrom,
          },
        }] : []),
        ...(data.dateTo ? [{
          createdAt: {
            [Op.lte]: data.dateTo,
          },
        }] : []),
      ],
    },
    attributes: { exclude: attributesToExclude },
    raw: true,
    nested: true,
  });

  return users;
};




