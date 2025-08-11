import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getCategories(): Promise<import("../entities/category.entity").Category[]>;
    seedCategories(): Promise<{
        message: string;
    }>;
    getCategoryById(id: string): Promise<import("../entities/category.entity").Category>;
}
