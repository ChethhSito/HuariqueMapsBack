import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';

export class CreateHuariqueDto {
  @ApiProperty({ description: 'Nombre del huarique', example: 'El Huarique de la Tía Veneno' })
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @ApiProperty({ description: 'Descripción detallada', example: 'Las mejores hamburguesas al paso.', required: false })
  @IsOptional()
  @IsString()
  readonly descripcion?: string;

  @ApiProperty({ description: 'Tipo de comida (ej: Marina, Criolla)', example: 'Criolla' })
  @IsNotEmpty()
  @IsString()
  readonly tipoComida: string;

  @ApiProperty({
    description: 'Coordenadas geográficas (GeoJSON Point)',
    example: { type: 'Point', coordinates: [-77.036886, -12.046374] }
  })
  @IsNotEmpty()
  readonly coordenadas: {
    type: 'Point';
    coordinates: number[];
  };

  @ApiProperty({ description: 'Horario de atención', example: 'Lun-Sab: 18:00 - 23:00', required: false })
  @IsOptional()
  @IsString()
  readonly horario?: string;

  @ApiProperty({ description: 'Imagen del huarique (opcional)', required: false })
  @IsOptional()
  @IsString()
  readonly imagen?: string;

  @ApiProperty({ description: 'Distrito del huarique (opcional)', example: 'LIMA', required: false })
  @IsOptional()
  @IsString()
  readonly distrito?: string;

  @ApiProperty({ description: 'Arreglo de URLs de imágenes extras opcionales', type: [String], required: false })
  @IsOptional()
  @IsArray()
  readonly imagenesExtras?: string[];

  @ApiProperty({ description: 'Indica si es un huarique popular', example: false, default: false, required: false })
  @IsOptional()
  @IsBoolean()
  readonly popular?: boolean;

  @ApiProperty({
    description: 'Rango de precios: 1 = Económico ($), 2 = Intermedio ($$), 3 = Premium ($$$)',
    enum: [1, 2, 3],
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsEnum([1, 2, 3], { message: 'priceLevel debe ser 1, 2 o 3' })
  readonly priceLevel?: number;

  @ApiProperty({ description: 'URL pública de imagen en Firebase Storage (admin)', required: false })
  @IsOptional()
  @IsString()
  readonly imagenUrl?: string;

  @ApiProperty({ description: 'Estado inicial del huarique (solo admin)', enum: ['PENDIENTE', 'APROBADO', 'RECHAZADO'], required: false })
  @IsOptional()
  @IsString()
  @IsEnum(['PENDIENTE', 'APROBADO', 'RECHAZADO'], { message: 'estado debe ser PENDIENTE, APROBADO o RECHAZADO' })
  readonly estado?: string;
}

export class UpdateHuariqueDto {
  @IsOptional()
  @IsString()
  readonly nombre?: string;

  @IsOptional()
  @IsString()
  readonly descripcion?: string;

  @IsOptional()
  @IsString()
  readonly tipoComida?: string;

  @IsOptional()
  readonly coordenadas?: {
    type: 'Point';
    coordinates: number[];
  };

  @IsOptional()
  @IsString()
  readonly horario?: string;

  @IsOptional()
  @IsString()
  readonly imagen?: string;

  @IsOptional()
  @IsString()
  readonly distrito?: string;

  @IsOptional()
  @IsArray()
  readonly imagenesExtras?: string[];

  @IsOptional()
  @IsBoolean()
  readonly popular?: boolean;

  @IsOptional()
  @IsString()
  readonly estado?: string;

  @IsOptional()
  @IsInt()
  @IsEnum([1, 2, 3], { message: 'priceLevel debe ser 1, 2 o 3' })
  readonly priceLevel?: number;
}
