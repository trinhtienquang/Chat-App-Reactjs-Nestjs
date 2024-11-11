import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from './channel.schema';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{name: Channel.name, schema: ChannelSchema}])
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [ChannelsService]
})
export class ChannelsModule {}
