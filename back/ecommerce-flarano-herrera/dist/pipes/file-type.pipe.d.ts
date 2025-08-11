import { PipeTransform } from '@nestjs/common';
export declare class FileTypePipe implements PipeTransform {
    private readonly allowedMimeTypes;
    constructor(allowedMimeTypes: string[]);
    transform(file: Express.Multer.File): Express.Multer.File;
}
