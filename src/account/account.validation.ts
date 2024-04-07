import Joi, { Schema } from 'joi';

export class AccountValidation {
  static readonly CREATE: Schema = Joi.object({
    userName: Joi.string().required().trim().max(50),
    accountNumber: Joi.string()
      .required()
      .trim()
      .pattern(new RegExp('\\d{10}'))
      .message('{#label} is not a valid account number!'),
    emailAddress: Joi.string()
      .required()
      .trim()
      .lowercase()
      .email({ tlds: { allow: false } })
      .message('{#label} is not a valid email address!'),
    identityNumber: Joi.string()
      .required()
      .trim()
      .pattern(new RegExp('\\d{8,12}'))
      .message('{#label} is not a valid identity number!'),
  });

  static readonly UPDATE: Schema = Joi.object({
    id: Joi.string().required(),
    userName: Joi.string().trim().max(50),
    accountNumber: Joi.string()
      .trim()
      .pattern(new RegExp('\\d{10}'))
      .message('{#label} is not a valid account number!'),
    emailAddress: Joi.string()
      .trim()
      .lowercase()
      .email({ tlds: { allow: false } })
      .message('{#label} is not a valid email address!'),
    identityNumber: Joi.string()
      .trim()
      .pattern(new RegExp('\\d{8,12}'))
      .message('{#label} is not a valid identity number!'),
  });

  static readonly DELETE: Schema = Joi.object({
    id: Joi.string().required(),
  });

  static readonly GET: Schema = Joi.object({
    id: Joi.string().required(),
  });

  static readonly SEARCH: Schema = Joi.object({
    userName: Joi.string().optional(),
    identityNumber: Joi.string().optional(),
    accountNumber: Joi.string().optional(),
    emailAddress: Joi.string().optional(),
    page: Joi.number().positive().required(),
    size: Joi.number().positive().required(),
  });
}
