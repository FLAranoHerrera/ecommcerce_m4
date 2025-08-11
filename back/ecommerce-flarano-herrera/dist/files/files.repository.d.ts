import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
export declare class FilesRepository {
    private readonly productRepository;
    constructor(productRepository: Repository<Product>);
    updateProductImage(productId: string, imageUrl: string): Promise<Product>;
}
