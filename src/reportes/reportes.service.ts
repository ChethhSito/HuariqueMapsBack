import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reporte } from './schemas/reporte.schema';

@Injectable()
export class ReportesService {
  constructor(@InjectModel(Reporte.name) private reporteModel: Model<Reporte>) {}

  async create(huariqueId: string, usuarioId: string, motivo: string, detalles?: string): Promise<Reporte> {
    const nuevoReporte = new this.reporteModel({
      huariqueId,
      usuarioId,
      motivo,
      detalles,
    });
    return nuevoReporte.save();
  }

  async findAll(): Promise<Reporte[]> {
    return this.reporteModel.find().exec();
  }

  async updateEstado(id: string, estado: string): Promise<Reporte> {
    const reporte = await this.reporteModel.findByIdAndUpdate(id, { estado }, { new: true }).exec();
    if (!reporte) throw new NotFoundException('Reporte no encontrado');
    return reporte;
  }
}
