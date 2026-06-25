import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  DatePipe,
  CurrencyPipe,
  NgClass,
  DecimalPipe,
} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { EventoService } from '../../../core/services/evento.service';
import {
  esEventoActivo,
  Evento,
  eventoEstadoLabel,
  EventoEstado,
} from '../../../core/models/evento.model';
import { ReporteOcupacion } from '../../../core/models/reserva.model';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-event-detail',
  imports: [
    RouterLink,
    DatePipe,
    CurrencyPipe,
    NgClass,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    DecimalPipe,
  ],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.scss',
})
export class EventDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly eventoService = inject(EventoService);
  private readonly alertService = inject(AlertService);

  evento = signal<Evento | null>(null);
  reporte = signal<ReporteOcupacion | null>(null);
  cargando = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargar(id);
  }

  private cargar(id: number): void {
    this.cargando.set(true);
    this.eventoService.obtener(id).subscribe({
      next: (e) => {
        this.evento.set(e);
        this.cargarReporte(id);
      },
      error: () => {
        this.alertService.error('Error al cargar el evento', 'No se pudo cargar el evento');
        this.cargando.set(false);
      },
    });
  }

  private cargarReporte(id: number): void {
    this.eventoService.reporte(id).subscribe({
      next: (r) => {
        this.reporte.set(r);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      },
    });
  }

  estadoColor(estado: EventoEstado): string {
    if (this.eventoActivo(estado)) return 'estado-activo';
    if (eventoEstadoLabel(estado) === 'Cancelado') {
      return 'estado-cancelado';
    }
    return 'estado-completado';
  }

  estadoLabel(estado: EventoEstado): string {
    return eventoEstadoLabel(estado);
  }

  eventoActivo(estado: EventoEstado): boolean {
    return esEventoActivo(estado);
  }

  get porcentaje(): number {
    return (this.reporte()?.porcentajeOcupacion ?? 0) / 100;
  }
}
