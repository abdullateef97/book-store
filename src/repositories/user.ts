import models from '../models';

export const createUserRepo = async (data: any): Promise<any> => {
  return models.users.create(data);
};

export const findOneUserRepo = async (where: { [key: string]: any }, attributes? : any): Promise<any> => {
  return models.users.findOne({
    where,
    ...(attributes && attributes),
  });
};

export const findAllUsersRepo = async (where: { [key: string]: any }, attributes? : any): Promise<any[]> => {
  return models.users.findAll({
    where,
    ...(attributes && attributes),
    raw: true,
    nested: true,
  });
};
