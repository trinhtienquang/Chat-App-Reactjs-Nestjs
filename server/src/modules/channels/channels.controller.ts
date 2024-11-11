import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, HttpStatus, BadRequestException } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelDto } from './dto/channel.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createChannelDto: ChannelDto) {
    return await this.channelsService.createChannel(createChannelDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getChannel(@Param('id') id: string) {
    const channel = await this.channelsService.getChannel(id);
    return channel;
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getChannelByUserId(@Param('userId') userId: string) {
    const channels = await this.channelsService.getChannelsByUser(userId);
    return channels;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateChannel(@Param('id') id: string, @Body() updateChannelDto:ChannelDto) {
    const result = await this.channelsService.updateChannel(id, updateChannelDto);
    return {
      message: 'Cập nhật channel thành công!',
      statusCode: HttpStatus.OK,
      result
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteChannel(@Param('id') id: string) {
    const result = await this.channelsService.deleteChannel(id);
    return result;
  }
}
