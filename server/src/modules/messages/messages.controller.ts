import { Controller, Get, Post, Body,Param, Delete, UseGuards, Put } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getMessage(@Param('id') id: string) {
    const message = await this.messagesService.getMessage(id);
    return message;
  }

  @Get('channel/:id')
  async getMessagesByChannel(@Param('id') id: string) {
    const message = await this.messagesService.getMessagesByChannel(id);
    return message;
  }

  @Post('')
  async createMessage(@Body() body) {
    const result = await this.messagesService.addMessage(body);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateMessage(@Param('id') id: string, @Body() body) {
    const result = await this.messagesService.updateMessage(id, body);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteMessage(@Param('id') id: string) {
    const result = await this.messagesService.deleteMessage(id);
    return result;
  }
}
