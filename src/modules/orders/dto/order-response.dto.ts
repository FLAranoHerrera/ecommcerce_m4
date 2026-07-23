import { ApiProperty } from '@nestjs/swagger';

class OrderProductResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'iPhone 15 Pro' })
  name: string;

  @ApiProperty({ example: 'https://example.com/product.jpg' })
  imgUrl: string;
}

class OrderItemResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: '999.99' })
  unitPrice: string;

  @ApiProperty({ example: '1999.98' })
  subtotal: string;

  @ApiProperty({ type: OrderProductResponseDto })
  product: OrderProductResponseDto;
}

class OrderDetailResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: '1999.98' })
  price: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];
}

class OrderUserResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'user@test.local' })
  email: string;

  @ApiProperty({ example: 'Usuario de prueba' })
  name: string;
}

export class OrderResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'date-time' })
  date: Date;

  @ApiProperty({ type: OrderUserResponseDto })
  user: OrderUserResponseDto;

  @ApiProperty({ type: OrderDetailResponseDto })
  orderDetail: OrderDetailResponseDto;
}

export class OrderListResponseDto {
  @ApiProperty({ type: [OrderResponseDto] })
  data: OrderResponseDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 25 })
  total: number;

  @ApiProperty({ example: 3 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;

  @ApiProperty({ example: false })
  hasPreviousPage: boolean;
}
