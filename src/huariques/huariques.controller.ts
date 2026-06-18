import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { HuariquesService } from './huariques.service';
import { CreateHuariqueDto } from './dto/create-huarique.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
    return this.huariquesService.findAll();
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
}
