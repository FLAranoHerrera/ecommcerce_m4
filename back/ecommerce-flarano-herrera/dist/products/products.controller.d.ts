import { ProductsService } from './products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(page: number, limit: number): Promise<{
        data: import("../entities/product.entity").Product[];
        page: number;
        limit: number;
        total: number;
    }>;
    seedProducts(): Promise<{
        message: string;
    }>;
    create(dto: CreateProductDto): Promise<{
        id: string;
    }>;
    findOne(id: string): Promise<import("../entities/product.entity").Product>;
    update(id: string, dto: UpdateProductDto): Promise<{
        id: string;
    }>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
