import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Suggestion extends Document {
  @ApiProperty({ example: 'Juan Pérez' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ example: 'juan@correo.com' })
  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @ApiProperty({ example: 'Cevichería El Primo en Surquillo, Jr. Dante 420.' })
  @Prop({ required: true })
  message: string;
}

export const SuggestionSchema = SchemaFactory.createForClass(Suggestion);
