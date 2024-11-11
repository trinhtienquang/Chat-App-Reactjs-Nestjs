import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ChannelDto } from './dto/channel.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Channel, ChannelDocument } from './channel.schema';
import mongoose, { Model  } from 'mongoose';
import { UserService } from '../users/user.service';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
    private userService: UserService
  ) {}

  async createChannel(createChannelDto: ChannelDto) {
    try{
      // Kiểm tra xem tất cả participants có tồn tại không
      const participantPromises = createChannelDto.participants.map(id => 
        this.userService.findById(id.toString())
      );
      const participants = await Promise.all(participantPromises);
      
      if (participants.some(p => !p)) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'One or more participants not found'
        };
      }

      const newChannel = new this.channelModel(createChannelDto);
      newChannel.save();
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Channel created successfully.',
        newChannel
      };
    }catch(error){
      console.error('Error creating channel:', error); // Log chi tiết lỗi
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error
      };
    }
  }

  async getChannel(id: string){
    try {
      // Kiểm tra xem ID có hợp lệ hay không
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID không hợp lệ');
      }

      const channel = await this.channelModel.findById(id).exec();

      if (!channel) {
        throw new NotFoundException('Không tìm thấy channel');
      }

      // Lấy thông tin chi tiết của participants
      const participantDetails = await Promise.all(
        channel.participants.map(async (participantId) => {
          const user = await this.userService.findById(participantId.toString());
          return user;
        })
      );

      // Lấy thông tin chi tiết của admins nếu có
      const adminDetails = channel.admins ? await Promise.all(
        channel.admins.map(async (adminId) => {
          const user = await this.userService.findById(adminId.toString());
          return user;
        })
      ) : [];

      const channelData = channel.toObject();
    // Cập nhật mảng participants với thông tin đầy đủ của users
    

      return {...channelData, participantDetails, adminDetails}

    } catch (error) {
      return error.response
    }
  }
  
  
  getChannelsByUser(userId:string) {
    return `This action returns all channels`;
  }

  async updateChannel(id: string, update:any) {
    try {
      const updatedChannel = await this.channelModel.findByIdAndUpdate(id, update, { new: true }).exec();
  
      if (!updatedChannel) {
        throw new NotFoundException(`Không tìm thấy channel với id: ${id}`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Channel updated successfully.',
        updatedChannel
      };
    } catch (error) {
      throw new BadRequestException('Đã xảy ra lỗi khi cập nhật thông tin channel');
    }
  }

  async deleteChannel(_id: string) {
    try {
      if (!mongoose.isValidObjectId(_id)) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid channel ID format'
        };
      }

      const result = await this.channelModel.deleteOne({ _id });
      
      if (result.deletedCount === 0) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Channel not found'
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Channel deleted successfully'
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error deleting channel'
      };
    }
  }
}
