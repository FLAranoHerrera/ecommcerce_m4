import {
  IsArray,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
  ArrayMinSize,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderProductDto {
  @ApiProperty({
    description: 'UUID del producto que se desea comprar',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Cantidad solicitada; si se omite se utiliza 1',
    example: 2,
    minimum: 1,
    default: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity = 1;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Productos y cantidades de la orden',
    type: () => [OrderProductDto],
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        quantity: 2,
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'La orden debe contener al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];
}
