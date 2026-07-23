import {
  Injectable,
  Inject,
  BadRequestException,
  BadGatewayException,
  Logger,
  ServiceUnavailableException,
  NotFoundException,
} from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { Product } from '../../database/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
    @Inject('CLOUDINARY') private cloudinaryClient: typeof cloudinary,
    private readonly config: ConfigService,
  ) {}

  async uploadProductImage(productId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (
      !this.config.get('CLOUDINARY_NAME') ||
      !this.config.get('CLOUDINARY_API_KEY') ||
      !this.config.get('CLOUDINARY_API_SECRET')
    ) {
      throw new ServiceUnavailableException(
        'Cloudinary no está configurado en este entorno',
      );
    }

    const product = await this.findProduct(productId);
    const previousPublicId = product.imagePublicId;

    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const uploadStream = this.cloudinaryClient.uploader.upload_stream(
          {
            public_id: `products/${productId}-${randomUUID()}`,
            resource_type: 'image',
            overwrite: true,
            invalidate: true,
          },
          (error, result) => {
            if (error) {
              return reject(
                new BadGatewayException('Cloudinary rechazó la imagen'),
              );
            }
            if (!result)
              return reject(
                new BadGatewayException(
                  'No se recibió respuesta de Cloudinary',
                ),
              );
            resolve(result);
          },
        );

        Readable.from(file.buffer).pipe(uploadStream);
      },
    );

    let updatedProduct: Product;
    try {
      product.imgUrl = uploadResult.secure_url;
      product.imagePublicId = uploadResult.public_id;
      updatedProduct = await this.products.save(product);
    } catch (error) {
      await this.destroyImage(uploadResult.public_id);
      throw error;
    }

    if (previousPublicId && previousPublicId !== uploadResult.public_id) {
      await this.destroyImage(previousPublicId);
    }

    return {
      message: 'Imagen cargada y producto actualizado exitosamente',
      imageUrl: uploadResult.secure_url,
      product: updatedProduct,
    };
  }

  private async destroyImage(publicId: string): Promise<void> {
    try {
      await this.cloudinaryClient.uploader.destroy(publicId, {
        resource_type: 'image',
        invalidate: true,
      });
    } catch (error) {
      this.logger.warn(
        `No fue posible limpiar la imagen ${publicId}: ${error instanceof Error ? error.message : 'error desconocido'}`,
      );
    }
  }

  private async findProduct(productId: string): Promise<Product> {
    const product = await this.products
      .createQueryBuilder('product')
      .addSelect('product.imagePublicId')
      .where('product.id = :productId', { productId })
      .getOne();
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product;
  }
}
