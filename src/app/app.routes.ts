import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'eventos', pathMatch: 'full' },
  {
    path: 'eventos',
    loadComponent: () =>
      import('./features/events/event-list/event-list').then((m) => m.EventListComponent),
  },
  {
    path: 'eventos/crear',
    loadComponent: () =>
      import('./features/events/event-create/event-create').then((m) => m.EventCreateComponent),
  },
  {
    path: 'eventos/:id',
    loadComponent: () =>
      import('./features/events/event-detail/event-detail').then((m) => m.EventDetailComponent),
  },
  {
    path: 'eventos/:id/reservar',
    loadComponent: () =>
      import('./features/reservations/reservation-create/reservation-create').then(
        (m) => m.ReservationCreateComponent,
      ),
  },
  {
    path: 'reservas/:id',
    loadComponent: () =>
      import('./features/reservations/reservation-detail/reservation-detail').then(
        (m) => m.ReservationDetailComponent,
      ),
  },
  {
    path: 'reservaciones',
    loadComponent: () =>
      import('./features/reservations/reservation-list/reservation-list').then(
        (m) => m.ReservationsListComponent,
      ),
  },
];
