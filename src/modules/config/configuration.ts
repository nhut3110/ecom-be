import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { configValidationSchema } from './app-config.validation';

export const configuration = async (): Promise<any> => {
  const config = (await yaml.load(
    readFileSync(
      join(process.cwd(), `config/${process.env.NODE_ENV}.yaml`),
      'utf8',
    ),
  )) as Record<string, any>;

  const { error, value: validatedConfig } = configValidationSchema.validate(
    config,
    { abortEarly: false, allowUnknown: true },
  );

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return validatedConfig;
};
