import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
export declare class CategoriesService {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    getCategories(): Promise<Category[]>;
    seedCategories(): Promise<{
        message: string;
    }>;
    findOrCreateCategory(name: string): Promise<Category>;
    getCategoryById(id: string): Promise<Category>;
}
