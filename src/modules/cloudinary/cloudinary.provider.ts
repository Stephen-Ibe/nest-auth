import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { CLOUDINARY } from 'src/base';

const configService = new ConfigService();

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: configService.get('CLD_CLOUD_NAME'),
      api_key: configService.get('CLD_API_KEY'),
      api_secret: configService.get('CLD_API_SECRET'),
    });
  },
};
