import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export const DB_HOST = configService.get('DB_HOST');
export const DB_PORT = configService.get('DB_PORT');
export const DB_USERNAME = configService.get('DB_USERNAME');
export const DB_PASSWORD = configService.get('DB_PASSWORD');
export const DB_NAME = configService.get('DB_NAME');
