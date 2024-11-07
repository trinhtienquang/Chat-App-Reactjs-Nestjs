import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { MessageModule } from '../message/message.module';

@Module({
  imports:[MessageModule],
  controllers: [ChannelController],
  providers: [ChannelService],
  exports:[ChannelService]
})
export class ChannelModule {}
