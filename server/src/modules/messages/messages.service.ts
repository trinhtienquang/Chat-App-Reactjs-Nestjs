import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './message.schema';
import mongoose, { Model } from 'mongoose';
import { UserService } from '../users/user.service';
import { ChannelsService } from '../channels/channels.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private userService: UserService,
    private channelService: ChannelsService
  ) {}

  async addMessage(createMessageDto: CreateMessageDto) {
    const { channelId, userId } = createMessageDto;
    const channel = await this.channelService.getChannel(channelId);
    if (!channel) {
        throw new NotFoundException(`Channel with ID ${channelId} not found.`);
    }

    const isParticipant = channel.participant.some(participant => 
      participant.toString() === userId
    );
    if (!isParticipant) {
        throw new BadRequestException('User is not a participant in this channel.');
    }
    try {
      const message = new this.messageModel(createMessageDto);
      await message.save();

      // Thêm ID của message vào mảng `messages` trong Channel
      await this.channelService.updateChannel(
        channelId,
        { $push: { messages: message._id } },
      );

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Message created successfully.'
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to create message.');
    }
  }

  async getMessage(id: string) {
    try {
      const message = await this.messageModel.findById(id);
      return message;
    } catch (error) {
      return {
        statusCode: '404',
        message: 'Message not found.'
      };
    }
  }

  async getMessagesByChannel(channelId: string) {
    try {
      const channel = await this.channelService.getChannel(channelId);
    if (!channel) {
        throw new NotFoundException(`Channel with ID ${channelId} not found.`);
    }

      // Lấy tất cả các tin nhắn của kênh này
      const messages = await this.messageModel.find({ channelId: channelId })
        .populate('userId')  // Đây là cách bạn sử dụng populate để lấy thông tin user liên quan
        .sort({ createdAt: 1 })  // Sắp xếp theo ngày tạo (tăng dần)

      if (messages.length === 0) {
        return {
          statusCode: 404,
          message: 'No messages found for this channel.',
        };
      }

      return {
        statusCode: 200,
        messages,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error retrieving messages.',
      };
    }
  }

  async updateMessage(id: string, updateMessageDto: CreateMessageDto) {
    try {
      const updatedMessage = await this.messageModel.findByIdAndUpdate(id, updateMessageDto, { new: true }).exec();
  
      if (!updatedMessage) {
        throw new NotFoundException(`Không tìm thấy tin nhắn với id: ${id}`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'message updated successfully.',
        updatedMessage
      };
    } catch (error) {
      throw new BadRequestException('Đã xảy ra lỗi khi cập nhật tin nhắn');
    }
  }

  async deleteMessage(_id: string) {
    try {
      if (!mongoose.isValidObjectId(_id)) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid message ID format'
        };
      }

      const result = await this.messageModel.deleteOne({ _id });
      
      if (result.deletedCount === 0) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'message not found'
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'message deleted successfully'
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error deleting message'
      };
    }
  }
}
