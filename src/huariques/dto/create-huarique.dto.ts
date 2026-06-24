import { ApiProperty } from '@nestjs/swagger';

export class CreateHuariqueDto {
  @ApiProperty({ description: 'Nombre del huarique', example: 'El Huarique de la Tía Veneno' })
  readonly nombre: string;

  @ApiProperty({ description: 'Descripción detallada', example: 'Las mejores hamburguesas al paso.', required: false })
  readonly descripcion?: string;

  @ApiProperty({ description: 'Tipo de comida (ej: Marina, Criolla)', example: 'Criolla' })
  readonly tipoComida: string;

  @ApiProperty({
    description: 'Coordenadas geográficas (GeoJSON Point)',
    example: { type: 'Point', coordinates: [-77.036886, -12.046374] }
  })
  readonly coordenadas: {
    type: 'Point';
    coordinates: number[]; // [longitud, latitud]
  };

  @ApiProperty({ description: 'Horario de atención', example: 'Lun-Sab: 18:00 - 23:00', required: false })
  readonly horario?: string;

  @ApiProperty({ description: 'Imagen del huarique (opcional)', required: false })
  readonly imagen?: string;

  @ApiProperty({ description: 'Distrito del huarique (opcional)', example: 'LIMA', required: false })
  readonly distrito?: string;

  @ApiProperty({ description: 'Indica si es un huarique popular', example: false, default: false, required: false })
  readonly popular?: boolean;
}
