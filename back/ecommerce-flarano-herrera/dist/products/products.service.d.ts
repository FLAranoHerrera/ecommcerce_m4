import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';
export declare class ProductsService {
    private productsRepository;
    private categoriesService;
    constructor(productsRepository: Repository<Product>, categoriesService: CategoriesService);
    create(dto: CreateProductDto): Promise<{
        id: string;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        data: Product[];
        page: number;
        limit: number;
        total: number;
    }>;
    findOne(id: string): Promise<Product>;
    update(id: string, dto: UpdateProductDto): Promise<{
        id: string;
    }>;
    remove(id: string): Promise<{
        id: string;
    }>;
    seedProducts(): Promise<{
        message: string;
    }>;
}
