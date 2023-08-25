import { RequestHandler } from 'express';
import * as postService from '../services/post';
import { AddCommentToPostInterface, CreatePostInterface, GetPostListInterface } from '../interfaces/post';
import * as utils from '../utils';
import * as responseManager from '../utils/responseManager';
import log from '../config/logger';
import { validateAddCommentToPost, validateCreatePostSchema, validateGetPostList } from '../validations/post';

export const createPost: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user;
    const data: CreatePostInterface = await utils.joiValidate(req.body, validateCreatePostSchema);
    const response = await postService.createPost(data, user.id);
    responseManager.successResponseConstructor(res, response);
  } catch (error) {
    log.error('error creating post');
    log.error(error);
    return responseManager.errorResponseConstructor(res, error);
  }
};

export const getPostDetails: RequestHandler = async (req, res) => {
  try {
    const postId = parseInt(req.params.post_id, 10);
    const response = await postService.getPostDetails(postId);
    responseManager.successResponseConstructor(res, response);
  } catch (error) {
    log.error('error getting post details');
    log.error(error);
    return responseManager.errorResponseConstructor(res, error);
  }
};

export const getPosts: RequestHandler = async (req, res) => {
  try {
    const data: GetPostListInterface = await utils.joiValidate(req.query, validateGetPostList);
    const response = await postService.getPosts(data);
    responseManager.successResponseConstructor(res, response);
  } catch (error) {
    log.error('error getting post list');
    log.error(error);
    return responseManager.errorResponseConstructor(res, error);
  }
};

export const addCommentToPost: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user;
    const postId = parseInt(req.params.post_id, 10);
    const data: AddCommentToPostInterface = await utils.joiValidate(req.body, validateAddCommentToPost);
    const response = await postService.addCommentToPost(data, postId, user.id);
    responseManager.successResponseConstructor(res, response);

  } catch (error) {
    log.error('error getting adding comment to post');
    log.error(error);
    return responseManager.errorResponseConstructor(res, error);
  }
};
