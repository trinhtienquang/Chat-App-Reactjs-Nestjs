import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChannelDocument = Channel & Document;

@Schema({ timestamps: true })
export class Channel {
  @Prop({ type: String, default: () => new Types.ObjectId().toString() })
  id: string;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  participants: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  admins: Types.ObjectId[];

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: [Types.ObjectId], ref: 'Message', default: [] })
  messages: Types.ObjectId[];

  @Prop({ type: String, maxlength: 50, required: true })
  name: string;

  @Prop({ type: String, default: '' })
  image: string;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
