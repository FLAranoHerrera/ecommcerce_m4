import { UsersService } from './users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page: number, limit: number): Promise<{
        data: {
            id: string;
            name: string;
            birthday: Date;
            email: string;
            phone: number;
            country: string;
            address: string;
            city: string;
            admin: boolean;
            orders: import("../entities/order.entity").Order[];
        }[];
        page: number;
        limit: number;
        total: number;
    }>;
    findOne(id: string): Promise<import("../types/user.types").UserWithOrders>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
    }>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
