import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import '../firebase-admin';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(nombre: string, email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await this.usersService.create(nombre, email, passwordHash);

    const payload = { sub: user._id, email: user.email, nombre: user.nombre };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = { sub: user._id, email: user.email, nombre: user.nombre, rol: user.rol };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    };
  }

  async loginGoogle(token: string) {
    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      const email = decodedToken.email;
      if (!email) throw new UnauthorizedException('El token de Google no contiene email');
      
      const nombre = decodedToken.name || email.split('@')[0];

      let user = await this.usersService.findByEmail(email);

      if (!user) {
        // Generar contraseña aleatoria si no existe
        const randomPassword = Math.random().toString(36).slice(-8) + 'A1!';
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(randomPassword, salt);
        user = await this.usersService.create(nombre, email, passwordHash);
      }

      const payload = { sub: user._id, email: user.email, nombre: user.nombre, rol: user.rol };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user._id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
        },
      };
    } catch (error) {
      console.error('Error al verificar token de Google', error);
      throw new UnauthorizedException('Token de Google inválido');
    }
  }
}
