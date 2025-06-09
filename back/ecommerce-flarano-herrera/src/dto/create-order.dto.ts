import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsNotEmpty()
  products: {
    id: string;
  }[];
}
