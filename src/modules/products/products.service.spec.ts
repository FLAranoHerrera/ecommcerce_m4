import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { Product } from '../../database/entities/product.entity';
import { CategoriesService } from '../categories/categories.service';
import { ProductSortField, SortOrder } from './dto/product-query.dto';

describe('ProductsService', () => {
  const query = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };
  const products = {
    create: jest.fn((value: Partial<Product>) => ({ ...value })),
    save: jest.fn((value: Partial<Product>) =>
      Promise.resolve({ id: 'product-id', ...value }),
    ),
    update: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => query),
  };
  const categories = {
    getCategoryById: jest.fn(),
    findOrCreateCategory: jest.fn(),
  };
  const service = new ProductsService(
    products as unknown as Repository<Product>,
    categories as unknown as CategoriesService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    for (const method of [
      'leftJoinAndSelect',
      'andWhere',
      'orderBy',
      'skip',
      'take',
    ] as const) {
      query[method].mockReturnThis();
    }
  });

  it('rejects an inverted price range', async () => {
    await expect(
      service.findAll({
        page: 1,
        limit: 5,
        minPrice: 20,
        maxPrice: 10,
        sortBy: ProductSortField.NAME,
        order: SortOrder.ASC,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns paginated products and applies filters', async () => {
    query.getManyAndCount.mockResolvedValue([[{ id: 'one' }], 6]);
    const result = await service.findAll({
      page: 2,
      limit: 5,
      search: 'phone',
      category: 'mobile',
      minPrice: 10,
      maxPrice: 100,
      inStock: true,
      sortBy: ProductSortField.PRICE,
      order: SortOrder.DESC,
    });
    expect(query.andWhere).toHaveBeenCalledTimes(5);
    expect(query.skip).toHaveBeenCalledWith(5);
    expect(result).toMatchObject({
      total: 6,
      totalPages: 2,
      hasNextPage: false,
      hasPreviousPage: true,
    });
  });

  it('creates a product in an existing category', async () => {
    categories.getCategoryById.mockResolvedValue({ id: 'category-id' });
    await expect(
      service.create({
        name: 'Phone',
        description: 'Description',
        price: 100,
        stock: 2,
        imgUrl: 'https://example.com/image.jpg',
        categoryId: 'category-id',
      }),
    ).resolves.toEqual({ id: 'product-id' });
  });

  it('reports missing products on lookup and delete', async () => {
    products.findOne.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    products.delete.mockResolvedValue({ affected: 0 });
    await expect(service.remove('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
