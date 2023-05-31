import * as Joi from 'joi';

const timeSpanExtension = Joi.extend((joi) => ({
  type: 'timeSpan',
  base: joi.string(),
  messages: {
    'timeSpan.invalidFormat': 'Invalid time span format',
  },
  validate(value, helpers) {
    const pattern = /^([0-9]+)(s|m|h|d)$/;
    if (!pattern.test(value)) {
      return { value, errors: helpers.error('timeSpan.invalidFormat') };
    }
  },
}));

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
  port: Joi.number().default(3000),
  client: Joi.string(),
  salt: Joi.number().required(),
  jwt: Joi.object({
    'secret-key': Joi.string().required(),
    'access-token-expire-in': Joi.alternatives().try(
      Joi.number().integer().min(0).required(),
      timeSpanExtension.timeSpan().required(),
    ),
    'refresh-token-expire-in': Joi.alternatives().try(
      Joi.number().integer().min(0).required(),
      timeSpanExtension.timeSpan().required(),
    ),
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
    'api-key': Joi.number().required(),
    'api-secret': Joi.string().required(),
  }),

  redis: Joi.object({
    port: Joi.number().required(),
    host: Joi.string().required(),
  }),
});
