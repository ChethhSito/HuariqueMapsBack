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

// Estructura para almacenar las Reseñas
@Schema({ _id: false })
export class Resena {
  @Prop({ required: true })
  usuarioId: string;

  @Prop({ required: true })
  usuarioNombre: string;

  @Prop({ required: true })
  comentario: string;

  @Prop({ required: true, min: 1, max: 5 })
  calificacion: number;

  @Prop({ default: Date.now })
  fecha: Date;
}

export const ResenaSchema = SchemaFactory.createForClass(Resena);

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

  @Prop({ trim: true })
  imagen: string; // URL de la imagen del huarique

  @Prop({ type: String })
  creadoPor: string; // ID del usuario que lo registró

  @Prop({ type: String })
  imagenUrl: string; // URL pública de Firebase Storage

  @Prop({ type: [String], default: [] })
  votosExiste: string[]; // Lista de IDs de usuarios que confirman que existe

  @Prop({ type: [String], default: [] })
  votosNoExiste: string[]; // Lista de IDs de usuarios que reportan que no existe

  @Prop({ type: [ResenaSchema], default: [] })
  resenas: Resena[];

  @Prop({ default: 0 })
  ratingPromedio: number;

  @Prop({ default: 0 })
  numResenas: number;

  @Prop({ type: String, enum: ['PENDIENTE', 'APROBADO', 'RECHAZADO'], default: 'PENDIENTE' })
  estado: string;

  @Prop({ type: [String], default: [] })
  likes: string[];
}

export const HuariqueSchema = SchemaFactory.createForClass(Huarique);

// Crear índice geoespacial 2dsphere para permitir búsquedas por cercanía o áreas
HuariqueSchema.index({ coordenadas: '2dsphere' });
