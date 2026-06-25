import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { catchError, finalize, of, switchMap } from 'rxjs';

import { ReservaService } from '../../../core/services/reserva.service';
import { Reserva, ReservaEstado } from '../../../core/models/reserva.model';
import { EventoService } from '../../../core/services/evento.service';
import { Evento } from '../../../core/models/evento.model';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-reservation-detail',
  imports: [
    RouterLink,
    DatePipe,
    CurrencyPipe,
    NgClass,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './reservation-detail.html',
  styleUrl: './reservation-detail.scss',
})
export class ReservationDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly reservaService = inject(ReservaService);
  private readonly eventoService = inject(EventoService);
  private readonly alertService = inject(AlertService);

  reserva = signal<Reserva | null>(null);
  evento = signal<Evento | null>(null);
  cargando = signal(true);
  procesando = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargar(id);
  }

  private cargar(id: number): void {
    this.cargando.set(true);
    this.evento.set(null);

    this.reservaService
      .obtener(id)
      .pipe(
        switchMap((r) => {
          this.reserva.set(r);
          return this.eventoService.obtener(r.eventoId).pipe(catchError(() => of(null)));
        }),
        finalize(() => this.cargando.set(false)),
      )
      .subscribe({
        next: (evento) => {
          this.evento.set(evento);
        },
        error: () => {
          this.alertService.error('Error al cargar la reserva', 'No se pudo cargar la reserva');
        },
      });
  }

  async confirmarPago(): Promise<void> {
    const confirmado = await this.alertService.confirm(
      'Confirmar pago',
      '¿Deseas confirmar el pago de esta reserva?',
    );

    if (!confirmado) {
      return;
    }

    this.procesando.set(true);

    this.reservaService.confirmarPago(this.reserva()!.id).subscribe({
      next: (r) => {
        this.reserva.set(r);
        this.procesando.set(false);

        this.alertService.success('Pago confirmado', `Código de reserva: ${r.codigoReserva}`);
      },
      error: (err) => {
        const msg = err?.error?.message ?? err?.error?.detail ?? 'Error al confirmar el pago';

        this.alertService.error('Error al confirmar el pago', msg);

        this.procesando.set(false);
      },
    });
  }

  async cancelarReserva(): Promise<void> {
    const inicio = this.evento()?.fechaHoraInicio;
    let mensaje = 'La reserva será cancelada y esta acción no se puede deshacer.';
    if (inicio) {
      const horas = (new Date(inicio).getTime() - Date.now()) / (1000 * 60 * 60);
      if (horas < 48) {
        mensaje +=
          '\n\n⚠️ El evento inicia en menos de 48 horas. Las entradas se marcarán como perdidas y aplicará penalización.';
      }
    }

    const confirmed = await this.alertService.confirm(
      'Cancelar Reserva',
      mensaje,
      'Sí, cancelar',
      'Volver',
    );

    if (!confirmed) {
      return;
    }

    this.procesando.set(true);

    this.reservaService.cancelar(this.reserva()!.id).subscribe({
      next: (r) => {
        this.reserva.set(r);
        this.procesando.set(false);

        this.alertService.success('Reserva cancelada', 'La reserva fue cancelada exitosamente.');
      },
      error: (err) => {
        const msg = err?.error?.message ?? err?.error?.detail ?? 'Error al cancelar la reserva';

        this.alertService.error('Error al cancelar la reserva', msg);

        this.procesando.set(false);
      },
    });
  }

  estadoColor(estado: ReservaEstado): string {
    const map: Record<ReservaEstado, string> = {
      PendientePago: 'estado-pendiente',
      Confirmada: 'estado-confirmada',
      Cancelada: 'estado-cancelada',
    };
    return map[estado];
  }

  estadoLabel(estado: ReservaEstado): string {
    const map: Record<ReservaEstado, string> = {
      PendientePago: 'Pendiente de Pago',
      Confirmada: 'Confirmada',
      Cancelada: 'Cancelada',
    };
    return map[estado];
  }
}
