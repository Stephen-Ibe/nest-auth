import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  providers: [CloudinaryProvider],
})
export class CloudinaryModule {}
