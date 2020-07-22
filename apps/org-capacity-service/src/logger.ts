import * as winston from 'winston';
import { environment } from './environments/environment';

const { LOG_LEVEL } = environment;

export const createLogger = (service: string, level: string) => winston.createLogger({
  level: level || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
  defaultMeta: { service: service },
  transports: [
    new winston.transports.Console()
  ]
});

export const logger = createLogger('org-capacity-service', LOG_LEVEL);
