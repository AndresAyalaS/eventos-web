export type EventoTipo = 'Conferencia' | 'Taller' | 'Concierto';

export type EventoEstado = 'Activo' | 'Cancelado' | 'Completado';

export interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  venueId: number;
  venueNombre: string;
  capacidadMaxima: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  precioEntrada: number;
  tipo: EventoTipo;
  estado: EventoEstado;
}

export interface CrearEventoRequest {
  titulo: string;
  descripcion: string;
  venueId: number;
  capacidadMaxima: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  precioEntrada: number;
  tipo: EventoTipo;
}

export interface EventoFiltros {
  tipo?: EventoTipo;
  fechaInicio?: string;
  fechaFin?: string;
  venueId?: number;
  estado?: EventoEstado;
  titulo?: string;
}

export function esEventoActivo(estado: EventoEstado): boolean {
  return estado === 'Activo';
}

export function eventoEstadoLabel(estado: EventoEstado): string {
  return estado;
}

export function eventoTipoLabel(tipo: EventoTipo): string {
  return tipo;
}
