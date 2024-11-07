import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Channel } from '../channel/channel.schema';
import { User } from '../users/user.schema';

export type MessageDocument = Message & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Message {
  @Prop({ type: String, default: () => new Types.ObjectId().toString() })
  id: string;

  @Prop({ type: Types.ObjectId, ref: 'Channel', required: true })
  channelId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Channel' })
  channel: Channel;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: [String], default: [] })
  images: string[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
