import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe, CurrencyPipe } from '@angular/common';

import { EventoService } from '../../../core/services/evento.service';
import { VenueService } from '../../../core/services/venue.service';
import {
  esEventoActivo,
  Evento,
  eventoEstadoLabel,
  EventoEstado,
  EventoFiltros,
  eventoTipoLabel,
  EventoTipo,
} from '../../../core/models/evento.model';
import { Venue } from '../../../core/models/venue.model';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-event-list',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss',
})
export class EventListComponent implements OnInit {
  private readonly eventoService = inject(EventoService);
  private readonly venueService = inject(VenueService);
  private readonly alertService = inject(AlertService);
  private readonly fb = inject(FormBuilder);

  eventos = signal<Evento[]>([]);
  venues = signal<Venue[]>([]);
  cargando = signal(false);

  readonly tipos: { value: EventoTipo; label: string }[] = [
    { value: 'Conferencia', label: 'Conferencia' },
    { value: 'Taller', label: 'Taller' },
    { value: 'Concierto', label: 'Concierto' },
  ];

  readonly estados: { value: EventoEstado; label: string }[] = [
    { value: 'Activo', label: 'Activo' },
    { value: 'Cancelado', label: 'Cancelado' },
    { value: 'Completado', label: 'Completado' },
  ];

  filtroForm = this.fb.group({
    titulo: [''],
    tipo: ['' as EventoTipo | ''],
    estado: ['' as EventoEstado | ''],
    venueId: [null as number | null],
    fechaInicio: [null as Date | null],
    fechaFin: [null as Date | null],
  });

  ngOnInit(): void {
    this.cargarVenues();
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    const val = this.filtroForm.value;

    const filtros: EventoFiltros = {};
    if (val.titulo) filtros.titulo = val.titulo;
    if (val.tipo) filtros.tipo = val.tipo as EventoTipo;
    if (val.estado) filtros.estado = val.estado as EventoEstado;
    if (val.venueId) filtros.venueId = val.venueId;
    if (val.fechaInicio) filtros.fechaInicio = (val.fechaInicio as Date).toISOString();
    if (val.fechaFin) filtros.fechaFin = (val.fechaFin as Date).toISOString();

    this.eventoService.listar(filtros).subscribe({
      next: (data) => {
        this.eventos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.alertService.error('Error al cargar eventos', 'No se pudo cargar los eventos');
        this.cargando.set(false);
      },
    });
  }

  limpiarFiltros(): void {
    this.filtroForm.reset();
    this.cargar();
  }

  private cargarVenues(): void {
    this.venueService.listar().subscribe({
      next: (data) => this.venues.set(data),
      error: () => {},
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

  tipoLabel(tipo: EventoTipo): string {
    return eventoTipoLabel(tipo);
  }
}
