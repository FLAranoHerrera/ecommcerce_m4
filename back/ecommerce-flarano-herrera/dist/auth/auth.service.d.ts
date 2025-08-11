import { UsersService } from '../users/users.service';
import { SigninDto } from '../dto/singin.dto';
import { SignupDto } from '../dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    signup(dto: SignupDto): Promise<{
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
    }>;
    signin(dto: SigninDto): Promise<{
        user: {
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
        };
        token: string;
    }>;
}
