import { Op } from 'sequelize';
import { AddCommentToPostInterface, CreatePostInterface, GetPostListInterface, PostInterface } from '../interfaces/post';
import models from '../models';
import { badRequestConstructor } from '../utils/responseManager';
import { createCommentRepo, createPostRepo, findAllPostsRepo, findOnePostRepo } from '../repositories/post';


export const getPostDetails = async (postId: number): Promise<PostInterface> => {
  const post = await findOnePostRepo({
    where: {
      id: postId,
    },
    attributes: { exclude: ['user_id'] },
    include: [
      {
        model: models.users,
        as: 'user',
        attributes: { exclude: ['id', 'password'] },
      },
      {
        model: models.comments,
        as: 'comments',
        attributes: { exclude: ['user_id'] },
        include: [
          {
            model: models.users,
            as: 'user',
            attributes: { exclude: ['id', 'password'] },
          },
        ],
      },
    ],
  });
  if (!post) {
    throw badRequestConstructor('No post found for post_id');
  }
  return post;
};


export const createPost = async (data: CreatePostInterface, userId: number): Promise<PostInterface> => {
  const post: PostInterface = await createPostRepo(
    {
      ...data,
      user_id: userId,
    },
  );
  return getPostDetails(post.id);
};

export const getPosts = async (data: GetPostListInterface): Promise<PostInterface[]> => {
  const posts: any = await findAllPostsRepo({
    where: {
      [models.Sequelize.Op.and]: [
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
    include: [
      {
        model: models.users,
        as: 'user',
        attributes:  ['user_id', 'email'],
      },
    ],
  });
  return posts;
};

export const addCommentToPost = async (data: AddCommentToPostInterface, postId: number, userId: number): Promise<PostInterface> => {
  await createCommentRepo({
    ...data,
    user_id: userId,
    post_id: postId,
  });
  return getPostDetails(postId);
};