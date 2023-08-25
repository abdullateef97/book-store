import models from '../models';

export const findOnePostRepo = (options: {
  where: { [key: string]: any },
  include?: any[],
  attributes?: any
}): Promise<any> => {
  return models.posts.findOne(options);
};

export const createPostRepo = (data: any): Promise<any> => {
  return models.posts.create(data);
};

export const findAllPostsRepo = (options: {
  where: { [key: string]: any },
  include?: any[],
  attributes?: any
}): Promise<any[]> => {
  return models.posts.findAll(options);
};

export const createCommentRepo = (data: any): Promise<any> => {
  return models.comments.create(data);
};