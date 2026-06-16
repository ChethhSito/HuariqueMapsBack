export class CreateHuariqueDto {
  readonly nombre: string;
  readonly descripcion?: string;
  readonly tipoComida: string;
  readonly coordenadas: {
    type: 'Point';
    coordinates: number[]; // [longitud, latitud]
  };
  readonly horario?: string;
}
