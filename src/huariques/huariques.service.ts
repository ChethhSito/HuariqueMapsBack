import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Huarique } from './schemas/huarique.schema';
import { CreateHuariqueDto } from './dto/create-huarique.dto';

@Injectable()
export class HuariquesService {
  constructor(
    @InjectModel(Huarique.name) private readonly huariqueModel: Model<Huarique>,
  ) {}

  // Crear un nuevo huarique
  async create(createHuariqueDto: CreateHuariqueDto): Promise<Huarique> {
    const newHuarique = new this.huariqueModel(createHuariqueDto);
    return newHuarique.save();
  }

  // Listar todos los huariques
  async findAll(): Promise<Huarique[]> {
    const list = await this.huariqueModel.find().exec();
    
    // Si la base de datos está vacía, retornamos una lista de ejemplo inicial
    if (list.length === 0) {
      return [
        {
          _id: 'mock1',
          nombre: 'El Huarique de la Tía Veneno',
          descripcion: 'Las mejores hamburguesas al paso y salchipapas de Lima.',
          tipoComida: 'Comida Rápida / Criolla',
          coordenadas: {
            type: 'Point',
            coordinates: [-77.036886, -12.046374], // Centro de Lima
          },
          horario: 'Lun-Sab: 18:00 - 23:00',
        },
        {
          _id: 'mock2',
          nombre: 'Cevichería El Arrecife',
          descripcion: 'El ceviche de carretilla más fresco y picante de la zona.',
          tipoComida: 'Marina',
          coordenadas: {
            type: 'Point',
            coordinates: [-77.029891, -12.121147], // Miraflores
          },
          horario: 'Mar-Dom: 11:30 - 16:30',
        },
      ] as any[];
    }
    
    return list;
  }

  // Buscar un huarique por ID
  async findOne(id: string): Promise<Huarique> {
    const huarique = await this.huariqueModel.findById(id).exec();
    if (!huarique) {
      throw new NotFoundException(`Huarique con ID ${id} no encontrado`);
    }
    return huarique;
  }
}
