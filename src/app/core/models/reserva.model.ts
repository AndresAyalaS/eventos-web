export type ReservaEstado = 'PendientePago' | 'Confirmada' | 'Cancelada';

export interface Reserva {
  id: number;
  eventoId: number;
  eventoTitulo: string;
  cantidad: number;
  nombreComprador: string;
  emailComprador: string;
  estado: ReservaEstado;
  codigoReserva?: string | null;
  fechaCreacion: string;
  fechaCancelacion?: string | null;
}

export interface CrearReservaRequest {
  eventoId: number;
  cantidad: number;
  nombreComprador: string;
  emailComprador: string;
}

export interface ReporteOcupacion {
  eventoId: number;
  eventoTitulo: string;
  totalEntradasVendidas: number;
  totalEntradasDisponibles: number;
  porcentajeOcupacion: number;
  totalIngresos: number;
  estadoEvento: number;
}
