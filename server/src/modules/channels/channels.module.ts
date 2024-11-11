import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from './channel.schema';
import { UserModule } from '../users/user.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [
    UserModule,
    MessagesModule,
    MongooseModule.forFeature([{name: Channel.name, schema: ChannelSchema}])
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
