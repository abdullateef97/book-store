import Joi from 'joi';
import joiDate from '@joi/date';

const dateValidator = Joi.extend(joiDate);


export const validateCreateUserSchema = Joi.object().keys({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(6).required(),
});

export const validateLoginUserSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(6).required(),
});

export const validateGetUserListSchema = Joi.object().keys({
  user_id: Joi.string(),
  email: Joi.string(),
  active: Joi.boolean(),
  dateFrom: dateValidator.date().format('YYYY-MM-DD').raw(),
  dateTo: dateValidator.date().format('YYYY-MM-DD').raw(),
});
