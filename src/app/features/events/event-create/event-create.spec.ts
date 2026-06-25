import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EventCreateComponent } from './event-create';
import { EventoService } from '../../../core/services/evento.service';
import { VenueService } from '../../../core/services/venue.service';
import { of } from 'rxjs';
import { Venue } from '../../../core/models/venue.model';
import { Evento } from '../../../core/models/evento.model';
import { vi } from 'vitest';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('EventCreateComponent', () => {
  let component: EventCreateComponent;
  let fixture: ComponentFixture<EventCreateComponent>;
  let eventoService: { crear: ReturnType<typeof vi.fn> };
  let venueService: { listar: ReturnType<typeof vi.fn> };
  let router: Router;

  const mockVenues: Venue[] = [
    { id: 1, nombre: 'Auditorio Central', capacidad: 200, ciudad: 'Bogotá' },
  ];

  const mockEvento: Evento = {
    id: 1,
    titulo: 'Nuevo Evento',
    descripcion: 'Descripción del evento',
    venueId: 1,
    venueNombre: 'string',
    capacidadMaxima: 50,
    fechaHoraInicio: '2025-07-15T14:00:00Z',
    fechaHoraFin: '2025-07-15T16:00:00Z',
    precioEntrada: 30,
    tipo: 'Taller',
    estado: 'Activo',
  };

  beforeEach(async () => {
    const eventoSpy = {
      crear: vi.fn(),
    };
    const venueSpy = {
      listar: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        EventCreateComponent,
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: EventoService, useValue: eventoSpy },
        { provide: VenueService, useValue: venueSpy },
        provideNativeDateAdapter(),
      ],
    }).compileComponents();

    eventoService = eventoSpy;
    venueService = venueSpy;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    venueService.listar.mockReturnValue(of(mockVenues));

    fixture = TestBed.createComponent(EventCreateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load venues on init', () => {
    fixture.detectChanges();
    expect(venueService.listar).toHaveBeenCalled();
    expect(component.venues()).toEqual(mockVenues);
  });

  it('should have required validators', () => {
    fixture.detectChanges();
    const tituloCtrl = component.form.get('titulo');
    tituloCtrl?.setValue('');
    expect(tituloCtrl?.hasError('required')).toBe(true);
  });

  it('should validate title length', () => {
    fixture.detectChanges();
    const tituloCtrl = component.form.get('titulo');
    tituloCtrl?.setValue('abc');
    expect(tituloCtrl?.hasError('minlength')).toBe(true);
  });

  it('should validate description length', () => {
    fixture.detectChanges();
    const descCtrl = component.form.get('descripcion');
    descCtrl?.setValue('short');
    expect(descCtrl?.hasError('minlength')).toBe(true);
  });

  it('should validate future dates', () => {
    fixture.detectChanges();
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const inicioCtrl = component.form.get('fechaInicio');
    inicioCtrl?.setValue(pastDate as never);
    expect(inicioCtrl?.hasError('fechaPasada')).toBe(true);
  });

  it('should validate price is positive', () => {
    fixture.detectChanges();
    const precioCtrl = component.form.get('precioEntrada');
    precioCtrl?.setValue(0);
    expect(precioCtrl?.hasError('min')).toBe(true);
  });

  it('should not submit invalid form', () => {
    fixture.detectChanges();
    component.form.patchValue({ titulo: '' });
    component.guardar();
    expect(eventoService.crear).not.toHaveBeenCalled();
  });

  it('should submit valid form', () => {
    fixture.detectChanges();

    eventoService.crear.mockReturnValue(of(mockEvento));

    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 2);
    fecha.setHours(0, 0, 0, 0);

    component.form.get('titulo')?.setValue('Nuevo Evento');
    component.form.get('descripcion')?.setValue('Descripción del evento válida');
    component.form.get('tipo')?.setValue('Taller');
    component.form.get('precioEntrada')?.setValue(30);
    component.form.get('venueId')?.setValue(1);
    component.form.get('capacidadMaxima')?.setValue(50);
    component.form.get('fechaInicio')?.setValue(fecha as never);
    component.form.get('horaInicio')?.setValue('14:00');
    component.form.get('fechaFin')?.setValue(new Date(fecha) as never);
    component.form.get('horaFin')?.setValue('16:00');

    component.form.updateValueAndValidity();

    expect(component.form.errors).toBeNull();
    expect(component.form.valid).toBe(true);

    component.guardar();

    expect(eventoService.crear).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/eventos', 1]);
  });
});
