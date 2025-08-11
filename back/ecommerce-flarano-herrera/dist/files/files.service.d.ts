import { FilesRepository } from './files.repository';
import { v2 as cloudinary } from 'cloudinary';
export declare class FilesService {
    private readonly filesRepository;
    private cloudinaryClient;
    constructor(filesRepository: FilesRepository, cloudinaryClient: typeof cloudinary);
    uploadProductImage(productId: string, file: Express.Multer.File): Promise<{
        message: string;
        imageUrl: string;
        product: import("../entities/product.entity").Product;
    }>;
}
