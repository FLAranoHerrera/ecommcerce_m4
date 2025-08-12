import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Multer } from 'multer';

@Injectable()
export class FileTypePipe implements PipeTransform {
  constructor(private readonly allowedMimeTypes: string[]) {}

  transform(file: Express.Multer.File) {
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Tipo de archivo no permitido: ${file.mimetype}`);
    }
    return file;
  }
}
