import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class MaxFileSizePipe implements PipeTransform {
  constructor(private readonly maxSizeInBytes: number) {}

  transform(file: Express.Multer.File) {
    if (file.size > this.maxSizeInBytes) {
      throw new BadRequestException(`El archivo supera los ${this.maxSizeInBytes / 1024} KB permitidos`);
    }
    return file;
  }
}
