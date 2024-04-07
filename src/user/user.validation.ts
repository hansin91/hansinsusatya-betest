import Joi, { Schema } from 'joi';

export class UserValidation {
  static readonly REGISTER: Schema = Joi.object({
    username: Joi.string().min(5).max(50).required(),
    password: Joi.string().required(),
    name: Joi.string().min(5).required(),
  });

  static readonly LOGIN: Schema = Joi.object({
    username: Joi.string().min(5).max(50).required(),
    password: Joi.string().required(),
  });
}
