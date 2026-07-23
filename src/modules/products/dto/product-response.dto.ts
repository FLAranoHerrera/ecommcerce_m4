import { ApiProperty } from '@nestjs/swagger';

export class ProductCategoryResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'smartphone' })
  name: string;
}

export class ProductResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'iPhone 15 Pro' })
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ example: 999.99 })
  price: number;

  @ApiProperty({ example: 48 })
  stock: number;

  @ApiProperty({ format: 'uri' })
  imgUrl: string;

  @ApiProperty({ type: ProductCategoryResponseDto })
  category: ProductCategoryResponseDto;
}

export class PaginatedProductsResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  data: ProductResponseDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 5 })
  limit: number;

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 5 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;

  @ApiProperty({ example: false })
  hasPreviousPage: boolean;
}
