import { ConflictException, NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Repository } from 'typeorm';
import { Category } from '../../database/entities/category.entity';
import { Product } from '../../database/entities/product.entity';

describe('CategoriesService', () => {
  const query = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };
  const categories = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn((value: Partial<Category>) => ({
      id: 'category-id',
      ...value,
    })),
    save: jest.fn((value: Category) => Promise.resolve(value)),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => query),
  };
  const products = { count: jest.fn() };
  const service = new CategoriesService(
    categories as unknown as Repository<Category>,
    products as unknown as Repository<Product>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    query.where.mockReturnThis();
    query.andWhere.mockReturnThis();
  });

  it('creates a category when its name is available', async () => {
    query.getOne.mockResolvedValue(null);
    await expect(service.create({ name: 'audio' })).resolves.toMatchObject({
      id: 'category-id',
      name: 'audio',
    });
  });

  it('rejects duplicate category names', async () => {
    query.getOne.mockResolvedValue({ id: 'existing' });
    await expect(service.create({ name: 'audio' })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('prevents deleting a category with products', async () => {
    categories.findOneBy.mockResolvedValue({ id: 'category-id' });
    products.count.mockResolvedValue(2);
    await expect(service.remove('category-id')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('deletes an unused category', async () => {
    const category = { id: 'category-id', name: 'unused' };
    categories.findOneBy.mockResolvedValue(category);
    products.count.mockResolvedValue(0);
    await expect(service.remove('category-id')).resolves.toEqual({
      id: 'category-id',
      message: 'Categoría eliminada exitosamente',
    });
    expect(categories.remove).toHaveBeenCalledWith(category);
  });

  it('reports an unknown category', async () => {
    categories.findOneBy.mockResolvedValue(null);
    await expect(service.getCategoryById('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
