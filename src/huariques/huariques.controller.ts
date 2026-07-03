import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { HuariquesService } from './huariques.service';
import { CreateHuariqueDto } from './dto/create-huarique.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('huariques')
@Controller('huariques')
export class HuariquesController {
  constructor(private readonly huariquesService: HuariquesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo huarique' })
  @ApiResponse({ status: 201, description: 'Huarique creado con éxito' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async create(@Body() createHuariqueDto: CreateHuariqueDto, @Request() req: any) {
    const userId = req.user?.sub;
    return this.huariquesService.create(createHuariqueDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los huariques aprobados' })
  @ApiResponse({ status: 200, description: 'Lista de huariques aprobados devuelta con éxito' })
  async findAll() {
    return this.huariquesService.findAllAprobados();
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos los huariques del sistema (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista completa de huariques devuelta con éxito' })
  @ApiResponse({ status: 403, description: 'Acceso denegado (requiere rol ADMIN)' })
  async findAllAdmin() {
    return this.huariquesService.findAll();
  }

  @Get('cercanos')
  @ApiOperation({ summary: 'Buscar huariques cercanos geoespacialmente' })
  @ApiQuery({ name: 'lat', type: Number, description: 'Latitud' })
  @ApiQuery({ name: 'lng', type: Number, description: 'Longitud' })
  @ApiQuery({ name: 'radio', type: Number, required: false, description: 'Radio de búsqueda en metros (default 5000)' })
  async findNearby(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radio') radio: number,
  ) {
    return this.huariquesService.findNearby(Number(lat), Number(lng), Number(radio) || 5000);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar un huarique por ID' })
  @ApiResponse({ status: 200, description: 'Huarique encontrado' })
  @ApiResponse({ status: 404, description: 'Huarique no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.huariquesService.findOne(id);
  }

  @Post(':id/validar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Votar si existe o no existe un huarique (Crowdsourcing)' })
  @ApiBody({ schema: { type: 'object', properties: { existe: { type: 'boolean' } } } })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agregar una reseña/comentario a un huarique' })
  @ApiBody({ schema: { type: 'object', properties: { comentario: { type: 'string' }, calificacion: { type: 'number', minimum: 1, maximum: 5 } } } })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modificar una reseña existente' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una reseña' })
  async removeResena(
    @Param('id') id: string,
    @Param('resenaId') resenaId: string,
  ) {
    return this.huariquesService.removeResena(id, resenaId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modificar los datos de un huarique' })
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.huariquesService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un huarique (Admin)' })
  async remove(@Param('id') id: string) {
    return this.huariquesService.remove(id);
  }

  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprobar, rechazar o poner pendiente un huarique (Admin)' })
  @ApiBody({ schema: { type: 'object', properties: { estado: { type: 'string', enum: ['APROBADO', 'PENDIENTE', 'RECHAZADO'] } } } })
  async updateEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.huariquesService.updateEstado(id, estado);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alternar like a un huarique (dar/quitar)' })
  async toggleLike(@Param('id') id: string, @Request() req: any) {
    return this.huariquesService.toggleLike(id, req.user.sub);
  }

  @Post(':id/imagen')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subir una imagen en Firebase Storage para el huarique' })
  @UseInterceptors(FileInterceptor('imagen', { storage: memoryStorage() }))
  async uploadImagen(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.huariquesService.uploadImagen(id, file);
  }
}
