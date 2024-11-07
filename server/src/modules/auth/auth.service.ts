import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}
    
    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        // Kiểm tra nếu user không tồn tại hoặc mật khẩu không đúng
        if (!user || !(await bcrypt.compare(pass, user.password))) {
            return null
        }
        return user;
      }

    async login(user:any) {
        const payload = { sub: user._id, username: user.username };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
      }
    
    async register(CreateUserDto: CreateUserDto){
        return this.userService.createUser(CreateUserDto);
    }
}
