import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

// Estructura GeoJSON para almacenar la ubicación del Huarique
@Schema({ _id: false })
export class PointGeometry {
  @ApiProperty({ example: 'Point' })
  @Prop({ type: String, enum: ['Point'], default: 'Point', required: true })
  type: string;

  @ApiProperty({ type: [Number], example: [-77.036886, -12.046374] })
  @Prop({ type: [Number], required: true }) // [longitud, latitud]
  coordinates: number[];
}

export const PointGeometrySchema = SchemaFactory.createForClass(PointGeometry);

// Estructura para almacenar las Reseñas
@Schema({ _id: false })
export class Resena {
  @ApiProperty()
  @Prop({ required: true })
  usuarioId: string;

  @ApiProperty()
  @Prop({ required: true })
  usuarioNombre: string;

  @ApiProperty()
  @Prop({ required: true })
  comentario: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @Prop({ required: true, min: 1, max: 5 })
  calificacion: number;

  @ApiProperty()
  @Prop({ default: Date.now })
  fecha: Date;
}

export const ResenaSchema = SchemaFactory.createForClass(Resena);

@Schema({ timestamps: true })
export class Huarique extends Document {
  @ApiProperty({ description: 'Nombre del Huarique' })
  @Prop({ required: true, trim: true })
  nombre: string;

  @ApiProperty({ description: 'Descripción detallada', required: false })
  @Prop({ trim: true })
  descripcion: string;

  @ApiProperty({ description: 'Tipo de comida (ej: Marina, Criolla, Amazónica, etc.)' })
  @Prop({ required: true, trim: true })
  tipoComida: string; // Ej: Marina, Criolla, Amazónica, etc.

  @ApiProperty({ type: PointGeometry })
  @Prop({ type: PointGeometrySchema, required: true })
  coordenadas: PointGeometry;

  @ApiProperty({ description: 'Horario de atención', required: false })
  @Prop()
  horario: string; // Ej: "Lun-Sab: 12:00 - 17:00"

  @ApiProperty({ description: 'URL de la imagen del huarique (obsoleto/local)', required: false })
  @Prop({ trim: true })
  imagen: string; // URL de la imagen del huarique

  @ApiProperty({ description: 'ID del usuario creador', required: false })
  @Prop({ type: String })
  creadoPor: string; // ID del usuario que lo registró

  @ApiProperty({ description: 'URL pública de la imagen en Firebase Storage', required: false })
  @Prop({ type: String })
  imagenUrl: string; // URL pública de Firebase Storage

  @ApiProperty({ type: [String], description: 'IDs de usuarios que confirman la existencia del local', default: [] })
  @Prop({ type: [String], default: [] })
  votosExiste: string[]; // Lista de IDs de usuarios que confirman que existe

  @ApiProperty({ type: [String], description: 'IDs de usuarios que reportan la no existencia del local', default: [] })
  @Prop({ type: [String], default: [] })
  votosNoExiste: string[]; // Lista de IDs de usuarios que reportan que no existe

  @ApiProperty({ type: [Resena], description: 'Lista de reseñas escritas por los usuarios', default: [] })
  @Prop({ type: [ResenaSchema], default: [] })
  resenas: Resena[];

  @ApiProperty({ description: 'Rating promedio de calificación (0.0 a 5.0)', default: 0 })
  @Prop({ default: 0 })
  ratingPromedio: number;

  @ApiProperty({ description: 'Número total de reseñas recibidas', default: 0 })
  @Prop({ default: 0 })
  numResenas: number;

  @ApiProperty({ description: 'Estado de aprobación del huarique', enum: ['PENDIENTE', 'APROBADO', 'RECHAZADO'], default: 'APROBADO' })
  @Prop({ type: String, enum: ['PENDIENTE', 'APROBADO', 'RECHAZADO'], default: 'APROBADO' })
  estado: string;

  @ApiProperty({ type: [String], description: 'Lista de IDs de usuarios que dieron Like al huarique', default: [] })
  @Prop({ type: [String], default: [] })
  likes: string[];

  @ApiProperty({ description: 'Distrito de Lima donde se ubica el huarique', required: false })
  @Prop({ type: String, trim: true })
  distrito: string;

  @ApiProperty({ type: [String], description: 'Arreglo de URLs de imágenes extras opcionales', default: [] })
  @Prop({ type: [String], default: [] })
  imagenesExtras: string[];

  @ApiProperty({ description: 'Indica si el huarique es popular y debe destacarse en la landing', default: false })
  @Prop({ type: Boolean, default: false })
  popular: boolean;

  @ApiProperty({ description: 'Rango de precios: 1 = Económico ($), 2 = Intermedio ($$), 3 = Premium ($$$)', enum: [1, 2, 3], required: false })
  @Prop({ type: Number, enum: [1, 2, 3] })
  priceLevel: number;
}

export const HuariqueSchema = SchemaFactory.createForClass(Huarique);

// Crear índice geoespacial 2dsphere para permitir búsquedas por cercanía o áreas
HuariqueSchema.index({ coordenadas: '2dsphere' });
