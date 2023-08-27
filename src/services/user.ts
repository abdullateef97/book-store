import { Op } from 'sequelize';
import { CreateUserInterface, GetUsersListInterface, LoginUserType, UserInterface } from '../interfaces/user';
import * as utils from '../utils';
import * as responseManager from '../utils/responseManager';
import { createUserRepo, findAllUsersRepo, findOneUserRepo, performanceChallengeRepo } from '../repositories/user';

export const createUser = async (data: CreateUserInterface): Promise<{ [key: string]: any }> => {
  const existingUser = await findOneUserRepo({
    email: data.email,
  });
  if (existingUser) {
    throw responseManager.badRequestConstructor('Please use another email, email already in use');
  }
  const hashedPassword = await utils.hashPassword(data.password);
  const userId = utils.generateUserId();

  await createUserRepo({
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
  const user: UserInterface = await findOneUserRepo({ email: data.email });

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
  const user = await findOneUserRepo({ user_id: userId }, { exclude: attributesToExclude });

  if (!user) {
    throw responseManager.badRequestConstructor('Invalid user id');
  }
  return user;
};

export const getUsersList = async (data: GetUsersListInterface): Promise<UserInterface[]> => {
  const attributesToExclude = ['password', 'id'];
  const where: { [key: string]: any } = {
    [Op.and]: [
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
  };
  const attributes = { exclude: attributesToExclude };
  const users = await findAllUsersRepo(where, attributes);

  return users;
};

export const performanceChallenge = async (): Promise<any[]> => {
  const [results] = await performanceChallengeRepo();
  return results;
};



