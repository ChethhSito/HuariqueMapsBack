import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    const { nombre, email, password } = body;
    
    if (!nombre || !email || !password) {
      throw new BadRequestException('Los campos nombre, email y password son obligatorios');
    }

    return this.authService.register(nombre, email, password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException('Los campos email y password son obligatorios');
    }

    return this.authService.login(email, password);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async loginGoogle(@Body() body: any) {
    const { token } = body;

    if (!token) {
      throw new BadRequestException('El token es obligatorio');
    }

    return this.authService.loginGoogle(token);
  }
}
