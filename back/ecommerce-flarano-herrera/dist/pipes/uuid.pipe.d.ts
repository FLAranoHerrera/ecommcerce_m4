import { PipeTransform } from '@nestjs/common';
export declare class UuidPipe implements PipeTransform<string> {
    transform(value: string): string;
}
