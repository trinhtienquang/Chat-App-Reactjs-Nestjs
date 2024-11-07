import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './user.schema'; // Import từ file schema bạn đã tạo
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Phương thức tạo user mới
  async createUser(createUserDto: CreateUserDto): Promise<User>{
    const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
  if (existingUser) {
    throw new BadRequestException('Email đã được sử dụng');
  }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

   // Phương thức tìm kiếm user bằng id
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password').exec();
  }

  // Phương thức tìm kiếm user bằng email
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('-password').lean();
  }

  async findByUsername(username: string): Promise<User[]> {
    return this.userModel.find({ username: { $regex: username, $options: 'i' } }).select('-password').exec();
  }

  // Phương thức cập nhật thông tin user
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User | null> 
  {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  
      if (!updatedUser) {
        throw new NotFoundException(`Không tìm thấy người dùng với id: ${id}`);
      }
  
      return updatedUser;
    } catch (error) {
      // Kiểm tra nếu lỗi là do trùng lặp tên người dùng
      if (error.code === 11000) {
        throw new BadRequestException('Tên người dùng đã được sử dụng');
      }
      // Xử lý các lỗi khác
      throw new BadRequestException('Đã xảy ra lỗi khi cập nhật thông tin người dùng');
    }
  }

  // Phương thức xoá user bằng ID
  async deleteUser(_id: string) {
    //check ID
    if(mongoose.isValidObjectId(_id)){
      //delete
      return this.userModel.deleteOne({_id});
    }else{
      throw new BadRequestException("Id không đúng định dạng")
    }
  }

}
