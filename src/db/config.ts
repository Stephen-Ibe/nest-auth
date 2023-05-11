import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const DATABASE_URL = configService.get('DATABASE_URL');
