import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Reporte extends Document {
  @Prop({ required: true })
  huariqueId: string;

  @Prop({ required: true })
  usuarioId: string;

  @Prop({ required: true })
  motivo: string; // Ej: "Local cerrado permanentemente", "Información falsa", "Ofensivo"

  @Prop()
  detalles: string;

  @Prop({ type: String, enum: ['PENDIENTE', 'RESUELTO', 'RECHAZADO'], default: 'PENDIENTE' })
  estado: string;
}

export const ReporteSchema = SchemaFactory.createForClass(Reporte);
