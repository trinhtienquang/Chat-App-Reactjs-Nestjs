import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
      const channel = await this.channelModel.findById(id).exec();

      if (!channel) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Channel not found'
        };
      }

      const participants = [];
    
    // Lặp qua từng participant ID và lấy thông tin user
    for (const participantId of channel.participants) {
      const user = await this.userService.findById(participantId.toString());
      if (user) {
        participants.push(user);
      }
    }

    // Tạo bản sao của channel để không ảnh hưởng dữ liệu gốc
    const channelData = channel.toObject();
    // Cập nhật mảng participants với thông tin đầy đủ của users
    channelData.participants = participants;

      return {
        statusCode: HttpStatus.OK,
        channelData
      } ;

    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving channel'
      };
    }
  }
  
  
  getChannelsByUser(userId:string) {
    return `This action returns all channels`;
  }

  async updateChannel(id: string, updateChannelDto:ChannelDto) {
    try {
      const updatedChannel = await this.channelModel.findByIdAndUpdate(id, updateChannelDto, { new: true }).exec();
  
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
