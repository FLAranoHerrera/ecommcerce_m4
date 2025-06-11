import { Module } from '@nestjs/common';
import { CloudinaryProvider } from '../config/cloudinary.config';

@Module({
  providers: [CloudinaryProvider],
  exports: [CloudinaryProvider],
})
export class CloudinaryModule {}
