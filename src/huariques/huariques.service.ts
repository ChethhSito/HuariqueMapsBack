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
  async create(createHuariqueDto: CreateHuariqueDto, creadoPor?: string): Promise<Huarique> {
    const newHuarique = new this.huariqueModel({
      ...createHuariqueDto,
      creadoPor,
      votosExiste: [],
      votosNoExiste: [],
      resenas: [],
      ratingPromedio: 0,
      numResenas: 0,
    });
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
          votosExiste: ['user1', 'user2', 'user3'],
          votosNoExiste: [],
          resenas: [
            { usuarioId: 'user1', usuarioNombre: 'Gastón A.', comentario: 'Increíbles salchipapas, la salsa de ají es secreta y espectacular.', calificacion: 5, fecha: new Date() },
            { usuarioId: 'user2', usuarioNombre: 'Sandra P.', comentario: 'Muy rico y barato, pero se llena rápido.', calificacion: 4, fecha: new Date() }
          ],
          ratingPromedio: 4.5,
          numResenas: 2
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
          votosExiste: ['user1'],
          votosNoExiste: [],
          resenas: [
            { usuarioId: 'user1', usuarioNombre: 'Gastón A.', comentario: 'El ceviche de carretilla por excelencia. Pica rico.', calificacion: 5, fecha: new Date() }
          ],
          ratingPromedio: 5.0,
          numResenas: 1
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

  // Votar existencia
  async votarExistencia(id: string, usuarioId: string, existe: boolean): Promise<Huarique> {
    const huarique = await this.findOne(id);

    // Inicializar arrays si no existen
    huarique.votosExiste = huarique.votosExiste || [];
    huarique.votosNoExiste = huarique.votosNoExiste || [];

    // Limpiar votos previos de este usuario para evitar duplicados
    huarique.votosExiste = huarique.votosExiste.filter(uid => uid !== usuarioId);
    huarique.votosNoExiste = huarique.votosNoExiste.filter(uid => uid !== usuarioId);

    if (existe) {
      huarique.votosExiste.push(usuarioId);
    } else {
      huarique.votosNoExiste.push(usuarioId);
    }

    return huarique.save();
  }

  // Agregar reseña
  async agregarResena(
    id: string,
    usuarioId: string,
    usuarioNombre: string,
    comentario: string,
    calificacion: number,
  ): Promise<Huarique> {
    const huarique = await this.findOne(id);

    const nuevaResena = {
      usuarioId,
      usuarioNombre,
      comentario,
      calificacion,
      fecha: new Date(),
    };

    huarique.resenas = huarique.resenas || [];
    huarique.resenas.push(nuevaResena as any);

    // Recalcular rating promedio y numResenas
    const totalCalificacion = huarique.resenas.reduce((sum, r) => sum + r.calificacion, 0);
    huarique.numResenas = huarique.resenas.length;
    huarique.ratingPromedio = Math.round((totalCalificacion / huarique.numResenas) * 10) / 10;

    return huarique.save();
  }
}
