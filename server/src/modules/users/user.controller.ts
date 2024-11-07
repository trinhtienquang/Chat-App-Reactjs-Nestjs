import { Controller, Post, Get, Param, Body, Delete, Patch, HttpStatus, UseGuards, Query, Search } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findUserById(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  findUserByName(@Query('search') name: string):Promise<User[]> {
    return this.userService.findByUsername(name);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<{ message: string; statusCode: number }> {
    await this.userService.updateUser(id, updateUserDto);
    
    return {
      message: 'Cập nhật người dùng thành công!',
      statusCode: HttpStatus.OK,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
