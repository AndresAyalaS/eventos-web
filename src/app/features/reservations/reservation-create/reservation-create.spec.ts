import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationCreateComponent } from './reservation-create';
import { EventoService } from '../../../core/services/evento.service';
import { ReservaService } from '../../../core/services/reserva.service';
import { of } from 'rxjs';
import { Evento } from '../../../core/models/evento.model';
import { Reserva } from '../../../core/models/reserva.model';
import { vi } from 'vitest';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReservationCreateComponent', () => {
  let component: ReservationCreateComponent;
  let fixture: ComponentFixture<ReservationCreateComponent>;
  let eventoService: { obtener: ReturnType<typeof vi.fn> };
  let reservaService: { crear: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  const mockEvento: Evento = {
    id: 1,
    titulo: 'Conferencia Angular',
    descripcion: 'Una conferencia sobre Angular',
    venueId: 1,
    venueNombre: 'string',
    capacidadMaxima: 100,
    fechaHoraInicio: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    fechaHoraFin: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    precioEntrada: 50,
    tipo: 'Conferencia',
    estado: 'Activo'
  };

  const mockReserva: Reserva = {
    id: 1,
    eventoId: 1,
    cantidad: 2,
     eventoTitulo: 'string',
    nombreComprador: 'Juan Pérez',
    emailComprador: 'juan@example.com',
    estado: 'PendientePago',
    fechaCreacion: new Date().toISOString()
  };

  beforeEach(async () => {
    const eventoSpy = {
      obtener: vi.fn()
    };
    const reservaSpy = {
      crear: vi.fn()
    };
    const routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        ReservationCreateComponent,
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: EventoService, useValue: eventoSpy },
        { provide: ReservaService, useValue: reservaSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        }
      ]
    }).compileComponents();

    eventoService = eventoSpy;
    reservaService = reservaSpy;
    router = routerSpy;

    eventoService.obtener.mockReturnValue(of(mockEvento));

    fixture = TestBed.createComponent(ReservationCreateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load evento on init', () => {
    fixture.detectChanges();
    expect(eventoService.obtener).toHaveBeenCalledWith(1);
    expect(component.evento()).toEqual(mockEvento);
  });

  it('should validate email format', () => {
    fixture.detectChanges();
    const emailCtrl = component.form.get('emailComprador');
    emailCtrl?.setValue('invalid-email');
    expect(emailCtrl?.hasError('email')).toBe(true);

    emailCtrl?.setValue('valid@example.com');
    expect(emailCtrl?.hasError('email')).toBeFalsy();
  });

  it('should require minimum quantity of 1', () => {
    fixture.detectChanges();
    const cantidadCtrl = component.form.get('cantidad');
    cantidadCtrl?.setValue(0);
    expect(cantidadCtrl?.hasError('min')).toBe(true);

    cantidadCtrl?.setValue(1);
    expect(cantidadCtrl?.hasError('min')).toBeFalsy();
  });

  it('should calculate total price correctly', () => {
    fixture.detectChanges();
    component.form.patchValue({ cantidad: 3 });
    expect(component.total).toBe(150); // 50 * 3
  });

  it('should not submit invalid form', () => {
    fixture.detectChanges();
    component.form.patchValue({ emailComprador: 'invalid' });
    component.reservar();
    expect(reservaService.crear).not.toHaveBeenCalled();
  });

  it('should submit valid form', () => {
    fixture.detectChanges();
    reservaService.crear.mockReturnValue(of(mockReserva));

    component.form.patchValue({
      cantidad: 2,
      nombreComprador: 'Juan Pérez',
      emailComprador: 'juan@example.com'
    });

    component.reservar();
    expect(reservaService.crear).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/reservas', 1]);
  });

  it('should enforce max 5 entries within 24 hours', () => {
    const eventoProximo: Evento = {
      ...mockEvento,
      fechaHoraInicio: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
    };
    eventoService.obtener.mockReturnValue(of(eventoProximo));
    fixture.detectChanges();

    expect(component.maxEntradas()).toBe(5);
  });

  it('should enforce max 10 entries for expensive events', () => {
    const eventoExpensivo: Evento = {
      ...mockEvento,
      precioEntrada: 150,
      fechaHoraInicio: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
    };
    eventoService.obtener.mockReturnValue(of(eventoExpensivo));
    fixture.detectChanges();

    expect(component.maxEntradas()).toBe(10);
  });
});
