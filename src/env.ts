import * as dotenv from 'dotenv';
import path from "path";

interface Validator {
  (arg: string): boolean;
}

const getOrDefault = (
  e: string,
  def: string,
  validator?: Validator,
): string => {
  const value = process.env[e];
  if (!value) {
    return def;
  }
  const isValid = validator ? validator(value) : true;
  return isValid ? value : def;
};

const getOrThrow = (e: string, message?: string, validator?: Validator) => {
  const value = process.env[e];
  if (!value) {
    throw new Error(message || `The environment variable ${e} is not set.`);
  }
  const isValid = validator ? validator(value) : true;
  if (!isValid) {
    throw new Error(message || `The environment variable ${e} is not valid.`);
  }
  return value;
};

const LOG_LEVELS = [
  'emerg',
  'alert',
  'crit',
  'error',
  'warning',
  'notice',
  'info',
  'debug',
];

const getLogLevel = () => {
  const level = getOrDefault('LOG_LEVEL', 'INFO', (v) =>
    LOG_LEVELS.includes(v.toLowerCase()),
  );
  return level.toLowerCase();
};

export interface AppEnv {
  APP_ENV: string;
  LOG_LEVEL: string;
}

interface Env extends AppEnv {}

dotenv.config({
  path: path.join(__dirname, '../.env')
});

const env: Env = {
  APP_ENV: getOrDefault('APP_ENV', 'DEV'),
  LOG_LEVEL: getLogLevel(),
};

export default env;
