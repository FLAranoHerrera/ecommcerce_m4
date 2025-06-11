import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { FilesRepository } from './files.repository';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Express } from 'express';
import * as streamifier from 'streamifier';

@Injectable()
export class FilesService {
  constructor(
    private readonly filesRepository: FilesRepository,
    @Inject('CLOUDINARY') private cloudinaryClient: typeof cloudinary,
  ) {}

  async uploadProductImage(productId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadStream = this.cloudinaryClient.uploader.upload_stream(
        {
          folder: 'products',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });

    const updatedProduct = await this.filesRepository.updateProductImage(
      productId,
      uploadResult.secure_url,
    );

    return {
      message: 'Imagen cargada y producto actualizado exitosamente',
      imageUrl: uploadResult.secure_url,
      product: updatedProduct,
    };
  }
}
