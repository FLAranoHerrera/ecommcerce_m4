import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserWithOrders } from '../types/user.types';
import { SignupDto } from '../dto/signup.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(signupDto: SignupDto): Promise<User>;
    findAll(page?: number, limit?: number): Promise<{
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
    findByEmail(email: string): Promise<User | null>;
    findOne(id: string): Promise<UserWithOrders>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
    }>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
