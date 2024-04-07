import * as Joi from 'joi';

export class ValidationService {
  validate = (schema: Joi.Schema, data: any) => {
    return schema.validate(data);
  };
}
