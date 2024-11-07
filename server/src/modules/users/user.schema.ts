import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs'

export type UserDocument = User & Document;

@Schema({ timestamps: false })
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  about: string;

  @Prop({
    default: 'https://res.cloudinary.com/dtzs4c2uv/image/upload/v1666326774/noavatar_rxbrbk.png'
  })
  image: string;

  @Prop({ type: [String], default: [] })
  friends: string[];

  @Prop({ type: [String], default: [] })
  blocked: string[];

  @Prop({ type: [String], default: [] })
  requests: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Sử dụng pre-save hook mà không cần HookNextFunction
UserSchema.pre<UserDocument>('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});