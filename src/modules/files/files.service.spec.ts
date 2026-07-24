import {
  BadGatewayException,
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassThrough } from 'node:stream';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Repository } from 'typeorm';
import { FilesService } from './files.service';
import { Product } from '../../database/entities/product.entity';

describe('FilesService', () => {
  const queryBuilder = {
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };
  const products = {
    createQueryBuilder: jest.fn(() => queryBuilder),
    save: jest.fn(),
  };
  const uploader = {
    upload_stream: jest.fn(),
    destroy: jest.fn(),
  };
  const cloudinaryClient = {
    uploader,
  } as unknown as typeof cloudinary;
  const config = {
    get: jest.fn(),
  };
  const service = new FilesService(
    products as unknown as Repository<Product>,
    cloudinaryClient,
    config as unknown as ConfigService,
  );
  const file = {
    buffer: Buffer.from('image-content'),
  } as Express.Multer.File;

  beforeEach(() => {
    jest.clearAllMocks();
    config.get.mockReturnValue('configured');
    uploader.destroy.mockResolvedValue({ result: 'ok' });
  });

  function mockUpload(
    result?: Partial<UploadApiResponse>,
    error?: Error,
  ): void {
    uploader.upload_stream.mockImplementation(
      (
        _options: unknown,
        callback: (error?: Error, result?: UploadApiResponse) => void,
      ) => {
        const stream = new PassThrough();
        stream.on('finish', () =>
          callback(error, result as UploadApiResponse | undefined),
        );
        return stream;
      },
    );
  }

  it('rejects requests without a file', async () => {
    await expect(
      service.uploadProductImage('product-id', undefined as never),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects uploads when Cloudinary is not configured', async () => {
    config.get.mockReturnValue(undefined);

    await expect(
      service.uploadProductImage('product-id', file),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
    expect(products.createQueryBuilder).not.toHaveBeenCalled();
  });

  it('rejects uploads for a missing product', async () => {
    queryBuilder.getOne.mockResolvedValue(null);

    await expect(
      service.uploadProductImage('missing', file),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('uploads an image, saves the product and removes the previous image', async () => {
    const product = {
      id: 'product-id',
      imgUrl: 'old-url',
      imagePublicId: 'products/old',
    } as Product;
    queryBuilder.getOne.mockResolvedValue(product);
    mockUpload({
      secure_url: 'https://cloudinary.test/new.jpg',
      public_id: 'products/new',
    });
    products.save.mockImplementation((value: Product) =>
      Promise.resolve(value),
    );

    await expect(
      service.uploadProductImage('product-id', file),
    ).resolves.toMatchObject({
      imageUrl: 'https://cloudinary.test/new.jpg',
      product: {
        imgUrl: 'https://cloudinary.test/new.jpg',
        imagePublicId: 'products/new',
      },
    });
    expect(uploader.destroy).toHaveBeenCalledWith('products/old', {
      resource_type: 'image',
      invalidate: true,
    });
  });

  it('removes the uploaded image when saving the product fails', async () => {
    queryBuilder.getOne.mockResolvedValue({
      id: 'product-id',
      imagePublicId: null,
    });
    mockUpload({
      secure_url: 'https://cloudinary.test/new.jpg',
      public_id: 'products/new',
    });
    products.save.mockRejectedValue(new Error('database unavailable'));

    await expect(
      service.uploadProductImage('product-id', file),
    ).rejects.toThrow('database unavailable');
    expect(uploader.destroy).toHaveBeenCalledWith('products/new', {
      resource_type: 'image',
      invalidate: true,
    });
  });

  it('translates Cloudinary failures and empty responses', async () => {
    queryBuilder.getOne.mockResolvedValue({
      id: 'product-id',
      imagePublicId: null,
    });
    mockUpload(undefined, new Error('cloud failure'));
    await expect(
      service.uploadProductImage('product-id', file),
    ).rejects.toBeInstanceOf(BadGatewayException);

    mockUpload();
    await expect(
      service.uploadProductImage('product-id', file),
    ).rejects.toBeInstanceOf(BadGatewayException);
  });

  it('does not fail a successful upload when old-image cleanup fails', async () => {
    queryBuilder.getOne.mockResolvedValue({
      id: 'product-id',
      imagePublicId: 'products/old',
    });
    mockUpload({
      secure_url: 'https://cloudinary.test/new.jpg',
      public_id: 'products/new',
    });
    products.save.mockImplementation((value: Product) =>
      Promise.resolve(value),
    );
    uploader.destroy.mockRejectedValue(new Error('cleanup failed'));

    await expect(
      service.uploadProductImage('product-id', file),
    ).resolves.toMatchObject({
      imageUrl: 'https://cloudinary.test/new.jpg',
    });
  });
});
