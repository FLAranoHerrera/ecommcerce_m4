import { IsArray, IsNumber, IsUUID, ArrayNotEmpty, IsPositive } from 'class-validator';

export class CreateOrderDetailDto {
  @IsNumber()
  @IsPositive()
  price: number;

  @IsUUID()
  orderId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  productIds: string[];
}
