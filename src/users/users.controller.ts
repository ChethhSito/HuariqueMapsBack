import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import * as bcrypt from 'bcryptjs';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('ADMIN')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  async getProfile(@Request() req: any) {
    return this.usersService.findById(req.user.sub);
  }

  @Patch('me')
  async updateProfile(@Request() req: any, @Body() body: any) {
    let passwordHash;
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(body.password, salt);
    }
    return this.usersService.updateProfile(req.user.sub, body.nombre, passwordHash);
  }

  @Patch(':id/rol')
  @Roles('ADMIN')
  async updateRole(@Param('id') id: string, @Body('rol') rol: string) {
    return this.usersService.updateRole(id, rol);
  }

  @Post('favoritos/:huariqueId')
  async addFavorite(@Request() req: any, @Param('huariqueId') huariqueId: string) {
    return this.usersService.toggleFavorite(req.user.sub, huariqueId);
  }

  @Delete('favoritos/:huariqueId')
  async removeFavorite(@Request() req: any, @Param('huariqueId') huariqueId: string) {
    return this.usersService.toggleFavorite(req.user.sub, huariqueId);
  }
}
