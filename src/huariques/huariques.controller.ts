import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { HuariquesService } from './huariques.service';
import { CreateHuariqueDto } from './dto/create-huarique.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('huariques')
export class HuariquesController {
  constructor(private readonly huariquesService: HuariquesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createHuariqueDto: CreateHuariqueDto, @Request() req: any) {
    const userId = req.user?.sub;
    return this.huariquesService.create(createHuariqueDto, userId);
  }

  @Get()
  async findAll() {
    return this.huariquesService.findAllAprobados();
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAllAdmin() {
    return this.huariquesService.findAll();
  }

  @Get('cercanos')
  async findNearby(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radio') radio: number,
  ) {
    return this.huariquesService.findNearby(Number(lat), Number(lng), Number(radio) || 5000);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.huariquesService.findOne(id);
  }

  @Post(':id/validar')
  @UseGuards(JwtAuthGuard)
  async validar(
    @Param('id') id: string,
    @Body('existe') existe: boolean,
    @Request() req: any,
  ) {
    const userId = req.user?.sub;
    return this.huariquesService.votarExistencia(id, userId, existe);
  }

  @Post(':id/resenas')
  @UseGuards(JwtAuthGuard)
  async agregarResena(
    @Param('id') id: string,
    @Body('comentario') comentario: string,
    @Body('calificacion') calificacion: number,
    @Request() req: any,
  ) {
    const userId = req.user?.sub;
    const userNombre = req.user?.nombre || 'Usuario Anónimo';
    return this.huariquesService.agregarResena(id, userId, userNombre, comentario, calificacion);
  }

  @Put(':id/resenas/:resenaId')
  @UseGuards(JwtAuthGuard)
  async updateResena(
    @Param('id') id: string,
    @Param('resenaId') resenaId: string,
    @Body('comentario') comentario: string,
    @Body('calificacion') calificacion: number,
  ) {
    return this.huariquesService.updateResena(id, resenaId, comentario, calificacion);
  }

  @Delete(':id/resenas/:resenaId')
  @UseGuards(JwtAuthGuard)
  async removeResena(
    @Param('id') id: string,
    @Param('resenaId') resenaId: string,
  ) {
    return this.huariquesService.removeResena(id, resenaId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.huariquesService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.huariquesService.remove(id);
  }

  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.huariquesService.updateEstado(id, estado);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async toggleLike(@Param('id') id: string, @Request() req: any) {
    return this.huariquesService.toggleLike(id, req.user.sub);
  }

  @Post(':id/imagen')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('imagen', { storage: memoryStorage() }))
  async uploadImagen(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.huariquesService.uploadImagen(id, file);
  }
}
