import * as Joi from 'joi';

const jwtExpireTimeSchema = Joi.string()
  .regex(/^([0-9]+)(s|m|h|d)$/)
  .required();

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
  port: Joi.number().default(3000),
  client: Joi.string(),
  salt: Joi.number().required(),
  jwt: Joi.object({
    'secret-key': Joi.string().required(),
    'access-token-expire-in': jwtExpireTimeSchema,
    'refresh-token-expire-in': jwtExpireTimeSchema,
  }),
  facebook: Joi.object({
    'client-id': Joi.number().required(),
    'client-secret': Joi.string().required(),
    'graph-url': Joi.string().required(),
  }),
  postgres: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    host: Joi.string().required(),
    port: Joi.number().required(),
    dialect: Joi.string().required(),
  }),

  cloudinary: Joi.object({
    'cloud-name': Joi.string().required(),
    'api-key': Joi.string().required(),
    'api-secret': Joi.string().required(),
  }),
});
