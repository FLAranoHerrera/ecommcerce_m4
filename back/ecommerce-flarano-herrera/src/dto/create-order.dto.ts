import { IsArray, IsNotEmpty, IsUUID, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class OrderProductDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'La orden debe contener al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];
}
