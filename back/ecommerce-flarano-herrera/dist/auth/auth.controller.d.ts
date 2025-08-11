import { AuthService } from './auth.service';
import { SigninDto } from '../dto/singin.dto';
import { SignupDto } from '../dto/signup.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
