import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Estructura GeoJSON para almacenar la ubicación del Huarique
@Schema({ _id: false })
export class PointGeometry {
  @Prop({ type: String, enum: ['Point'], default: 'Point', required: true })
  type: string;

  @Prop({ type: [Number], required: true }) // [longitud, latitud]
  coordinates: number[];
}

export const PointGeometrySchema = SchemaFactory.createForClass(PointGeometry);

@Schema({ timestamps: true })
export class Huarique extends Document {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ trim: true })
  descripcion: string;

  @Prop({ required: true, trim: true })
  tipoComida: string; // Ej: Marina, Criolla, Amazónica, etc.

  @Prop({ type: PointGeometrySchema, required: true })
  coordenadas: PointGeometry;

  @Prop()
  horario: string; // Ej: "Lun-Sab: 12:00 - 17:00"
}

export const HuariqueSchema = SchemaFactory.createForClass(Huarique);

// Crear índice geoespacial 2dsphere para permitir búsquedas por cercanía o áreas
HuariqueSchema.index({ coordenadas: '2dsphere' });
