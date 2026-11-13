export interface NotaCapitulo {
  capitulo: number;
  comentario?: string;
  rating?: number;
}

export type EstadoObra = 'En publicación' | 'Finalizada' | 'Cancelado';

export class Manhwa {
  id: number;
  clienteId: number;
  titulo: string;
  episodiosTotales: number;
  episodioActual: number;
  finalizadoPorLector: boolean;
  pausadoPorLector: boolean;
  estadoObra: EstadoObra;
  enlaceWeb: string;
  notas: NotaCapitulo[];
  ratingGlobal: number;
  fechaAgregado: Date;
}