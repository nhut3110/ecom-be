import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export const configuration = () => {
  return yaml.load(
    readFileSync(join(__dirname, `/${process.env.NODE_ENV}.yaml`), 'utf8'),
  ) as Record<string, any>;
};
