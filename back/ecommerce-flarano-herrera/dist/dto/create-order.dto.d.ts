declare class OrderProductDto {
    id: string;
}
export declare class CreateOrderDto {
    userId: string;
    products: OrderProductDto[];
}
export {};
