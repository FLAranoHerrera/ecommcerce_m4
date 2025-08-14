import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileTypePipe implements PipeTransform {
  constructor(private readonly allowedMimeTypes: string[]) {}

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido: ${file.mimetype}. Tipos permitidos: ${this.allowedMimeTypes.join(', ')}`
      );
    }

    // Validar extensión del archivo
    const allowedExtensions: string[] = [];
    this.allowedMimeTypes.forEach(mime => {
      switch (mime) {
        case 'image/jpeg':
        case 'image/jpg':
          allowedExtensions.push('.jpg');
          break;
        case 'image/png':
          allowedExtensions.push('.png');
          break;
        case 'image/webp':
          allowedExtensions.push('.webp');
          break;
      }
    });

    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        `Extensión de archivo no permitida: ${fileExtension}. Extensiones permitidas: ${allowedExtensions.join(', ')}`
      );
    }

    return file;
  }
}
