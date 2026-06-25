import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { EventoService } from '../../../core/services/evento.service';
import { ReservaService } from '../../../core/services/reserva.service';
import { Evento } from '../../../core/models/evento.model';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-reservation-create',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CurrencyPipe,
    DatePipe,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './reservation-create.html',
  styleUrl: './reservation-create.scss',
})
export class ReservationCreateComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventoService = inject(EventoService);
  private readonly reservaService = inject(ReservaService);
  private readonly alertService = inject(AlertService);
  private readonly fb = inject(FormBuilder);

  evento = signal<Evento | null>(null);
  cargando = signal(true);
  guardando = signal(false);

  /** Límite máximo de entradas según RN-04/RN-05 */
  maxEntradas = signal(10);

  form = this.fb.group({
    cantidad: [1, [Validators.required, Validators.min(1)]],
    nombreComprador: ['', [Validators.required, Validators.minLength(3)]],
    emailComprador: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventoService.obtener(id).subscribe({
      next: (e) => {
        this.evento.set(e);
        this.cargando.set(false);
        this.calcularLimite(e);
      },
      error: () => {
        this.alertService.error('No se pudo cargar el evento', 'Error');
        this.cargando.set(false);
      },
    });
  }

  private calcularLimite(evento: Evento): void {
    const ahora = new Date();
    const inicio = new Date(evento.fechaHoraInicio);
    const horasParaInicio = (inicio.getTime() - ahora.getTime()) / (1000 * 60 * 60);

    // RN-05: precio > $100 → máximo 10
    // RF-03: menos de 24h → máximo 5 (prioridad sobre RN-05)
    let limite = horasParaInicio < 24 ? 5 : evento.precioEntrada > 100 ? 10 : 100;
    this.maxEntradas.set(limite);

    this.form
      .get('cantidad')
      ?.setValidators([Validators.required, Validators.min(1), Validators.max(limite)]);
    this.form.get('cantidad')?.updateValueAndValidity();
  }

  get total(): number {
    const cantidad = this.form.get('cantidad')?.value ?? 0;
    return (this.evento()?.precioEntrada ?? 0) * cantidad;
  }

  get f() {
    return this.form.controls;
  }

  reservar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const v = this.form.value;

    this.reservaService
      .crear({
        eventoId: this.evento()!.id,
        cantidad: v.cantidad!,
        nombreComprador: v.nombreComprador!,
        emailComprador: v.emailComprador!,
      })
      .subscribe({
        next: (reserva) => {
          this.alertService.success('Reserva creada', `La reserva #${reserva.id} fue creada correctamente`);
          this.router.navigate(['/reservas', reserva.id]);
        },
        error: (err) => {
          const msg = this.obtenerMensajeError(err);
          this.alertService.error('Error al crear la reserva', msg);
          this.guardando.set(false);
        },
      });
  }

  private obtenerMensajeError(err: unknown): string {
    const error = (err as { error?: unknown })?.error;

    if (Array.isArray(error)) {
      const messages = error.map((item) => (item as { message?: string })?.message).filter(Boolean);
      return messages.length ? messages.join('. ') : 'Error al crear la reserva';
    }

    if (error && typeof error === 'object') {
      const response = error as { message?: string; detail?: string; title?: string };
      return response.message ?? response.detail ?? response.title ?? 'Error al crear la reserva';
    }

    return 'Error al crear la reserva';
  }
}
