import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Evento, CrearEventoRequest, EventoFiltros } from '../models/evento.model';
import { ReporteOcupacion } from '../models/reserva.model';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/Events`;

  listar(filtros?: EventoFiltros): Observable<Evento[]> {
    if (!filtros) {
      return this.http.get<Evento[]>(this.base);
    }
    let params = new HttpParams();
    if (filtros.tipo) params = params.set('Tipo', filtros.tipo);
    if (filtros.fechaInicio) params = params.set('FechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params = params.set('FechaFin', filtros.fechaFin);
    if (filtros.venueId) params = params.set('VenueId', filtros.venueId);
    if (filtros.estado) params = params.set('Estado', filtros.estado);
    if (filtros.titulo) params = params.set('Titulo', filtros.titulo);
    return this.http.get<Evento[]>(`${this.base}/search`, { params });
  }

  obtener(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.base}/${id}`);
  }

  crear(dto: CrearEventoRequest): Observable<Evento> {
    return this.http.post<Evento>(this.base, dto);
  }

  reporte(id: number): Observable<ReporteOcupacion> {
    return this.http.get<ReporteOcupacion>(`${this.base}/${id}/occupancy`);
  }
}
