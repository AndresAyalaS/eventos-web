import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { ReservaService } from '../../../core/services/reserva.service';
import { Reserva } from '../../../core/models/reserva.model';

@Component({
  selector: 'app-reservation-list',
  imports: [CommonModule, RouterModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './reservation-list.html',
  styleUrl: './reservation-list.scss',
})
export class ReservationsListComponent {

  private readonly reservaService = inject(ReservaService);
  readonly loading = signal(true);
  readonly reserva = signal<Reserva[]>([]);

  ngOnInit() {
    this.loadReservations();
  }

  private loadReservations() {
    this.reservaService
      .obtenerReservations()
      .subscribe({
        next: data => {
          this.reserva.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }
}
