import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado con éxito' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o el correo ya existe' })
  async register(@Body() body: any) {
    const { nombre, email, password } = body;
    
    if (!nombre || !email || !password) {
      throw new BadRequestException('Los campos nombre, email y password son obligatorios');
    }

    return this.authService.register(nombre, email, password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión clásico (correo y contraseña)' })
  @ApiResponse({ status: 200, description: 'Login exitoso, devuelve JWT token' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() body: any) {
    const { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException('Los campos email y password son obligatorios');
    }

    return this.authService.login(email, password);
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión mediante Google OAuth' })
  @ApiResponse({ status: 200, description: 'Login exitoso con Google, devuelve JWT token' })
  @ApiResponse({ status: 401, description: 'Token de Google inválido o fallido' })
  async loginGoogle(@Body() body: any) {
    const { token } = body;

    if (!token) {
      throw new BadRequestException('El token es obligatorio');
    }

    return this.authService.loginGoogle(token);
  }
}
