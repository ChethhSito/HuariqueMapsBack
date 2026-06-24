import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Huarique } from './schemas/huarique.schema';
import { CreateHuariqueDto } from './dto/create-huarique.dto';
import { adminStorage } from '../firebase-admin';
import * as path from 'path';
import { randomUUID } from 'crypto';

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
      estado: 'PENDIENTE',
      likes: [],
    });
    return newHuarique.save();
  }

  // Buscar cercanos
  async findNearby(lat: number, lng: number, maxDistance: number = 5000): Promise<Huarique[]> {
    return this.huariqueModel.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'distancia',
          maxDistance: maxDistance,
          spherical: true,
          query: { estado: 'APROBADO' }
        }
      }
    ]).exec();
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
          numResenas: 2,
          estado: 'APROBADO',
          distrito: 'LIMA',
          popular: true
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
          numResenas: 1,
          estado: 'APROBADO',
          distrito: 'MIRAFLORES',
          popular: true
        },
      ] as any[];
    }
    
    return list;
  }

  // Listar solo los aprobados
  async findAllAprobados(): Promise<Huarique[]> {
    return this.huariqueModel.find({ estado: 'APROBADO' }).exec();
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

  // Alternar Like
  async toggleLike(id: string, usuarioId: string): Promise<Huarique> {
    const huarique = await this.findOne(id);
    huarique.likes = huarique.likes || [];
    const index = huarique.likes.indexOf(usuarioId);
    if (index > -1) {
      huarique.likes.splice(index, 1);
    } else {
      huarique.likes.push(usuarioId);
    }
    return huarique.save();
  }

  // Actualizar Estado
  async updateEstado(id: string, estado: string): Promise<Huarique> {
    const huarique = await this.findOne(id);
    huarique.estado = estado;
    return huarique.save();
  }

  // Editar Huarique
  async update(id: string, updateData: any): Promise<Huarique> {
    const huarique = await this.huariqueModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!huarique) throw new NotFoundException(`Huarique con ID ${id} no encontrado`);
    return huarique;
  }

  // Eliminar Huarique
  async remove(id: string): Promise<void> {
    const result = await this.huariqueModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Huarique con ID ${id} no encontrado`);
  }

  // Eliminar Reseña
  async removeResena(id: string, resenaId: string): Promise<Huarique> {
    const huarique = await this.findOne(id);
    huarique.resenas = huarique.resenas.filter((r: any) => r._id.toString() !== resenaId);
    
    // Recalcular
    const totalCalificacion = huarique.resenas.reduce((sum, r) => sum + r.calificacion, 0);
    huarique.numResenas = huarique.resenas.length;
    huarique.ratingPromedio = huarique.numResenas > 0 ? Math.round((totalCalificacion / huarique.numResenas) * 10) / 10 : 0;
    
    return huarique.save();
  }

  // Editar Reseña
  async updateResena(id: string, resenaId: string, comentario: string, calificacion: number): Promise<Huarique> {
    const huarique = await this.findOne(id);
    const resena = huarique.resenas.find((r: any) => r._id.toString() === resenaId);
    if (!resena) throw new NotFoundException('Reseña no encontrada');

    resena.comentario = comentario;
    resena.calificacion = calificacion;

    // Recalcular
    const totalCalificacion = huarique.resenas.reduce((sum, r) => sum + r.calificacion, 0);
    huarique.ratingPromedio = huarique.numResenas > 0 ? Math.round((totalCalificacion / huarique.numResenas) * 10) / 10 : 0;

    return huarique.save();
  }

  // Subir imagen a Firebase Storage y guardar URL en el huarique
  async uploadImagen(id: string, file: Express.Multer.File): Promise<Huarique> {
    const huarique = await this.findOne(id);

    // Generar nombre único para el archivo en el bucket
    const extension = path.extname(file.originalname) || '.jpg';
    const fileName = `huariques/${id}/${randomUUID()}${extension}`;

    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(fileName);

    // Subir el buffer directamente a Firebase Storage
    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Hacer el archivo público y obtener la URL
    await fileRef.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Guardar la URL en MongoDB
    huarique.imagenUrl = publicUrl;
    return huarique.save();
  }
}
