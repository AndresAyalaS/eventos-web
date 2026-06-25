import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reserva, CrearReservaRequest } from '../models/reserva.model';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/Reservations`;

  crear(dto: CrearReservaRequest): Observable<Reserva> {
    return this.http.post<Reserva>(this.base, dto);
  }

  obtenerReservations() {
    return this.http.get<Reserva[]>(this.base);
  }

  obtener(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.base}/${id}`);
  }

  confirmarPago(id: number): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.base}/${id}/confirm-payment`, {});
  }

  cancelar(id: number): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.base}/${id}/cancel`, {});
  }

}
