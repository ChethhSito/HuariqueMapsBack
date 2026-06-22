import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reportes')
@UseGuards(JwtAuthGuard)
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Post()
  async create(@Request() req: any, @Body() body: any) {
    return this.reportesService.create(body.huariqueId, req.user.sub, body.motivo, body.detalles);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async findAll() {
    return this.reportesService.findAll();
  }

  @Patch(':id/estado')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async updateEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.reportesService.updateEstado(id, estado);
  }
}
