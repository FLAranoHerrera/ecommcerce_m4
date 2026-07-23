import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileTypePipe implements PipeTransform {
  constructor(private readonly allowedMimeTypes: string[]) {}

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    const signatures: Record<string, boolean> = {
      'image/jpeg': file.buffer
        .subarray(0, 3)
        .equals(Buffer.from([0xff, 0xd8, 0xff])),
      'image/png': file.buffer
        .subarray(0, 8)
        .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
      'image/webp':
        file.buffer.subarray(0, 4).toString() === 'RIFF' &&
        file.buffer.subarray(8, 12).toString() === 'WEBP',
    };

    if (
      !this.allowedMimeTypes.includes(file.mimetype) ||
      !signatures[file.mimetype]
    ) {
      throw new BadRequestException(
        `Tipo de archivo no permitido: ${file.mimetype}. Tipos permitidos: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    // Validar extensión del archivo
    const allowedExtensions: string[] = [];
    this.allowedMimeTypes.forEach((mime) => {
      switch (mime) {
        case 'image/jpeg':
        case 'image/jpg':
          allowedExtensions.push('.jpg', '.jpeg');
          break;
        case 'image/png':
          allowedExtensions.push('.png');
          break;
        case 'image/webp':
          allowedExtensions.push('.webp');
          break;
      }
    });

    const fileExtension = file.originalname
      .toLowerCase()
      .substring(file.originalname.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        `Extensión de archivo no permitida: ${fileExtension}. Extensiones permitidas: ${allowedExtensions.join(', ')}`,
      );
    }

    return file;
  }
}
