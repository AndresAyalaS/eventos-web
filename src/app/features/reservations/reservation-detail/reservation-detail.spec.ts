import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { ReservationDetailComponent } from './reservation-detail';
import { ReservaService } from '../../../core/services/reserva.service';
import { EventoService } from '../../../core/services/evento.service';
import { AlertService } from '../../../core/services/alert.service';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Reserva } from '../../../core/models/reserva.model';
import { Evento } from '../../../core/models/evento.model';

describe('ReservationDetailComponent', () => {
  let component: ReservationDetailComponent;
  let fixture: ComponentFixture<ReservationDetailComponent>;
  let reservaService: {
    obtener: ReturnType<typeof vi.fn>;
    confirmarPago: ReturnType<typeof vi.fn>;
    cancelar: ReturnType<typeof vi.fn>;
  };
  let alertService: {
    confirm: ReturnType<typeof vi.fn>;
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };

  const mockEvento: Evento = {
    id: 1,
    titulo: 'Conferencia Angular',
    descripcion: 'Una conferencia sobre Angular',
    venueId: 1,
    venueNombre: 'Auditorio Central',
    capacidadMaxima: 100,
    fechaHoraInicio: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    fechaHoraFin: new Date(Date.now() + 50 * 60 * 60 * 1000).toISOString(),
    precioEntrada: 50,
    tipo: 'Conferencia',
    estado: 'Activo',
  };

  const mockReserva: Reserva = {
    id: 1,
    eventoId: 1,
    eventoTitulo: 'titulo',
    cantidad: 2,
    nombreComprador: 'Juan Pérez',
    emailComprador: 'juan@example.com',
    estado: 'PendientePago',
    fechaCreacion: new Date().toISOString(),
  };

  const mockReservaConfirmada: Reserva = {
    ...mockReserva,
    estado: 'Confirmada',
    codigoReserva: 'EV-123456',
  };

  beforeEach(async () => {
    const reservaSpy = {
      obtener: vi.fn(),
      confirmarPago: vi.fn(),
      cancelar: vi.fn(),
    };
    const eventoSpy = {
      obtener: vi.fn(),
    };
    const alertSpy = {
      confirm: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReservationDetailComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: ReservaService, useValue: reservaSpy },
        { provide: EventoService, useValue: eventoSpy },
        { provide: AlertService, useValue: alertSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
    }).compileComponents();

    reservaService = reservaSpy;
    alertService = alertSpy;
    reservaService.obtener.mockReturnValue(of(mockReserva));
    eventoSpy.obtener.mockReturnValue(of(mockEvento));

    fixture = TestBed.createComponent(ReservationDetailComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load reserva on init', () => {
    fixture.detectChanges();
    expect(reservaService.obtener).toHaveBeenCalledWith(1);
    expect(component.reserva()).toEqual(mockReserva);
  });

  it('should confirm payment', async () => {
    fixture.detectChanges();
    reservaService.confirmarPago.mockReturnValue(of(mockReservaConfirmada));
    alertService.confirm.mockResolvedValue(true);

    await component.confirmarPago();

    expect(reservaService.confirmarPago).toHaveBeenCalledWith(1);
    expect(component.reserva()?.estado).toBe('Confirmada');
    expect(component.reserva()?.codigoReserva).toBe('EV-123456');
  });

  it('should cancel reservation', async () => {
    fixture.detectChanges();
    const cancelledReserva: Reserva = {
      ...mockReserva,
      estado: 'Cancelada',
      fechaCancelacion: new Date().toISOString(),
    };
    reservaService.cancelar.mockReturnValue(of(cancelledReserva));
    alertService.confirm.mockResolvedValue(true);

    await component.cancelarReserva();

    expect(reservaService.cancelar).toHaveBeenCalledWith(1);
    expect(component.reserva()?.estado).toBe('Cancelada');
  });

  it('should not confirm without user confirmation', async () => {
    fixture.detectChanges();
    alertService.confirm.mockResolvedValue(false);

    await component.confirmarPago();
    expect(reservaService.confirmarPago).not.toHaveBeenCalled();
  });

  it('should not cancel without user confirmation', async () => {
    fixture.detectChanges();
    alertService.confirm.mockResolvedValue(false);

    await component.cancelarReserva();
    expect(reservaService.cancelar).not.toHaveBeenCalled();
  });

  it('should return correct estado color', () => {
    expect(component.estadoColor('PendientePago')).toBe('estado-pendiente');
    expect(component.estadoColor('Confirmada')).toBe('estado-confirmada');
    expect(component.estadoColor('Cancelada')).toBe('estado-cancelada');
  });

  it('should return correct estado label', () => {
    expect(component.estadoLabel('PendientePago')).toBe('Pendiente de Pago');
    expect(component.estadoLabel('Confirmada')).toBe('Confirmada');
    expect(component.estadoLabel('Cancelada')).toBe('Cancelada');
  });

  it('should handle loading state', () => {
    expect(component.cargando()).toBe(true);
    fixture.detectChanges();
    expect(component.cargando()).toBe(false);
  });
});
