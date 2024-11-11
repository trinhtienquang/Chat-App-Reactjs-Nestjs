import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type ChannelDocument = Channel & Document;

@Schema({ timestamps: true })
export class Channel {
  @Prop({ type: [String], required: true })
  participants: string[];

  @Prop({ type: [String]})
  admins: string[];

  @Prop()
  description: string;

  @Prop({ type: [String], default: [] })
  messages: string[];

  @Prop()
  name: string;

  @Prop({
    default: 'https://res.cloudinary.com/dtzs4c2uv/image/upload/v1666326774/noavatar_rxbrbk.png'
  })
  image: string;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
