import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum ProductSortField {
  NAME = 'name',
  PRICE = 'price',
  STOCK = 'stock',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class ProductQueryDto {
  @ApiPropertyOptional({ type: Number, example: 1, default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({
    type: Number,
    example: 10,
    default: 5,
    minimum: 1,
    maximum: 100,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 5;

  @ApiPropertyOptional({
    description: 'Texto contenido en el nombre del producto',
    example: 'iPhone',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  search?: string;

  @ApiPropertyOptional({
    description: 'Nombre o UUID de la categoría',
    example: 'smartphone',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 100, minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional({ example: 2000, minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: '`true` muestra productos disponibles; `false`, agotados',
    example: true,
    type: Boolean,
  })
  @Transform(({ value }: { value: unknown }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  @IsOptional()
  inStock?: boolean;

  @ApiPropertyOptional({
    enum: ProductSortField,
    default: ProductSortField.NAME,
  })
  @IsEnum(ProductSortField)
  @IsOptional()
  sortBy: ProductSortField = ProductSortField.NAME;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.ASC })
  @IsEnum(SortOrder)
  @IsOptional()
  order: SortOrder = SortOrder.ASC;
}
