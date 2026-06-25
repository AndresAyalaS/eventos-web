import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EventoService } from '../../../core/services/evento.service';
import { VenueService } from '../../../core/services/venue.service';
import { Venue } from '../../../core/models/venue.model';
import { EventoTipo } from '../../../core/models/evento.model';
import {
  isAfterDateTime,
  isFutureDate,
  toUtcString,
} from '../../../shared/utils/date.utils';
import { AlertService } from '../../../core/services/alert.service';

function fechaFuturaValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  return isFutureDate(control.value) ? null : { fechaPasada: true };
}

export function finDespuesInicio(group: AbstractControl): ValidationErrors | null {
  const fechaInicio = group.get('fechaInicio')?.value;
  const horaInicio = group.get('horaInicio')?.value;

  const fechaFin = group.get('fechaFin')?.value;
  const horaFin = group.get('horaFin')?.value;

  if (!fechaInicio || !horaInicio || !fechaFin || !horaFin) {
    return null;
  }

  return isAfterDateTime(fechaInicio, horaInicio, fechaFin, horaFin)
    ? null
    : { finAntesDeinicio: true };
}

@Component({
  selector: 'app-event-create',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './event-create.html',
  styleUrl: './event-create.scss',
})
export class EventCreateComponent implements OnInit {
  private readonly eventoService = inject(EventoService);
  private readonly venueService = inject(VenueService);
  private readonly alertService = inject(AlertService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  venues = signal<Venue[]>([]);
  guardando = signal(false);
  venueSeleccionado = signal<Venue | null>(null);

  readonly tipos: { value: EventoTipo; label: string }[] = [
    { value: 'Conferencia', label: 'Conferencia' },
    { value: 'Taller', label: 'Taller' },
    { value: 'Concierto', label: 'Concierto' },
  ];

  form = this.fb.group(
    {
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      venueId: [null as number | null, Validators.required],
      capacidadMaxima: [null as number | null, [Validators.required, Validators.min(1)]],
      fechaInicio: [null as Date | null, [Validators.required, fechaFuturaValidator]],
      fechaFin: [null as Date | null, Validators.required],
      horaInicio: ['', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]],
      horaFin: ['', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]],
      precioEntrada: [null as number | null, [Validators.required, Validators.min(0.01)]],
      tipo: ['' as EventoTipo | '', Validators.required],
    },
    { validators: finDespuesInicio },
  );

  ngOnInit(): void {
    this.venueService.listar().subscribe({
      next: (data) => this.venues.set(data),
      error: () => this.alertService.error('Error al cargar venues', 'Error'),
    });

    this.form.get('venueId')?.valueChanges.subscribe((id) => {
      const venue = this.venues().find((v) => v.id === id) ?? null;
      this.venueSeleccionado.set(venue);
      const capCtrl = this.form.get('capacidadMaxima');
      if (venue) {
        capCtrl?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(venue.capacidad),
        ]);
      } else {
        capCtrl?.setValidators([Validators.required, Validators.min(1)]);
      }
      capCtrl?.updateValueAndValidity();
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    this.guardando.set(true);
    this.eventoService
      .crear({
        titulo: v.titulo!,
        descripcion: v.descripcion!,
        venueId: v.venueId!,
        capacidadMaxima: v.capacidadMaxima!,
        fechaHoraInicio: toUtcString(v.fechaInicio!, v.horaInicio!),
        fechaHoraFin: toUtcString(v.fechaFin!, v.horaFin!),
        precioEntrada: v.precioEntrada!,
        tipo: v.tipo as EventoTipo,
      })
      .subscribe({
        next: (evento) => {
          this.alertService.success('Evento creado exitosamente', `El evento "${evento.titulo}" fue creado correctamente`);
          this.router.navigate(['/eventos', evento.id]);
        },
        error: (err) => {
          const msg = err?.error?.message ?? err?.error?.detail ?? 'Error al crear el evento';
          this.alertService.error('Error al crear el evento', msg);
          this.guardando.set(false);
        },
      });
  }

  get f() {
    return this.form.controls;
  }
}
