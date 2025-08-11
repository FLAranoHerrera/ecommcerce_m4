import { FilesService } from './files.service';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    uploadImage(id: string, file: Express.Multer.File): Promise<{
        message: string;
        imageUrl: string;
        product: import("../entities/product.entity").Product;
    }>;
}
