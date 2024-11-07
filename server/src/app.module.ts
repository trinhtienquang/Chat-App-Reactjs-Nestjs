import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from './config/mongodb.config';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MessageModule } from './modules/message/message.module';
import { ChannelModule } from './modules/channel/channel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (ConfigService: ConfigService) => ({
        uri: ConfigService.get<string>('mongodb.uri'),
      }),
    }),
    UserModule,
    AuthModule,
    MessageModule,
    ChannelModule,
  ],
  providers: [ ChatGateway],
})
export class AppModule {}
