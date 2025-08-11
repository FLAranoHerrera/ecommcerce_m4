import { PipeTransform } from '@nestjs/common';
export declare class MaxFileSizePipe implements PipeTransform {
    private readonly maxSizeInBytes;
    constructor(maxSizeInBytes: number);
    transform(file: Express.Multer.File): Express.Multer.File;
}
