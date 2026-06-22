import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async create(nombre: string, email: string, passwordHash: string): Promise<User> {
    const newUser = new this.userModel({
      nombre,
      email: email.toLowerCase(),
      passwordHash,
    });
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({}, '-passwordHash').exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id, '-passwordHash').exec();
  }

  async updateRole(id: string, rol: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, { rol }, { new: true, select: '-passwordHash' }).exec();
  }

  async updateProfile(id: string, nombre?: string, passwordHash?: string): Promise<User | null> {
    const updateData: any = {};
    if (nombre) updateData.nombre = nombre;
    if (passwordHash) updateData.passwordHash = passwordHash;
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true, select: '-passwordHash' }).exec();
  }

  async toggleFavorite(userId: string, huariqueId: string): Promise<User | null> {
    const user = await this.userModel.findById(userId);
    if (!user) return null;

    const index = user.favoritos.indexOf(huariqueId);
    if (index > -1) {
      user.favoritos.splice(index, 1);
    } else {
      user.favoritos.push(huariqueId);
    }
    return user.save();
  }
}
