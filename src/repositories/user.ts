import models from '../models';

export const createUserRepo = async (data: any): Promise<any> => {
  return models.users.create(data);
};

export const findOneUserRepo = async (where: { [key: string]: any }, attributes? : any): Promise<any> => {
  return models.users.findOne({
    where,
    ...(attributes && { attributes }),
  });
};

export const findAllUsersRepo = async (where: { [key: string]: any }, attributes? : any): Promise<any[]> => {
  return models.users.findAll({
    where,
    ...(attributes && { attributes }),
    raw: true,
    nested: true,
  });
};

export const performanceChallengeRepo = async (): Promise<any[]> => {
  return models.sequelize.query(`
    select result.user_id, result.comment, result."createdAt" as dateCommentWasPosted, users.first_name, users.last_name from (
      select distinct on(comments.user_id) comments.user_id, comment, comments."createdAt" from comments where user_id in (
      select user_id from posts group by user_id order by count(*) desc limit 3
      ) order by comments.user_id, comments."createdAt" desc
    ) as result join users on result.user_id = users.id
  `);
};
