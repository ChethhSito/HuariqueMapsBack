import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { Reporte, ReporteSchema } from './schemas/reporte.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reporte.name, schema: ReporteSchema }]),
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
