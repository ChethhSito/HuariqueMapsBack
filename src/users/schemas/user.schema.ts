import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ type: String, enum: ['USER', 'ADMIN'], default: 'USER' })
  rol: string;

  @Prop({ type: [String], default: [] })
  favoritos: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
