import Joi from 'joi';
import joiDate from '@joi/date';

const dateValidator = Joi.extend(joiDate);

export const validateCreatePostSchema = Joi.object().keys({
  title: Joi.string().min(3).max(50).required(),
  content: Joi.string().min(3).max(200).required(),
});

export const validateGetPostList = Joi.object().keys({
  dateFrom: dateValidator.date().format('YYYY-MM-DD').raw(),
  dateTo: dateValidator.date().format('YYYY-MM-DD').raw(),
});

export const validateAddCommentToPost = Joi.object().keys({
  comment: Joi.string().min(5).max(75).required(),
});
