import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  IsUUID,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Smartphone XYZ',
    maxLength: 50
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example: 'Smartphone de última generación con cámara de alta resolución'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 999.99,
    minimum: 0
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Cantidad disponible en stock',
    example: 100,
    minimum: 0
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/image.jpg',
    required: false
  })
  @IsString()
  @IsOptional()
  imgUrl?: string;

  @ApiProperty({
    description: 'ID de la categoría a la que pertenece el producto',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  categoryId: string;
}
