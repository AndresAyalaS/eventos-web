import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { EventDetailComponent } from './event-detail';
import { EventoService } from '../../../core/services/evento.service';
import { of } from 'rxjs';
import { Evento } from '../../../core/models/evento.model';
import { ReporteOcupacion } from '../../../core/models/reserva.model';
import { vi } from 'vitest';

describe('EventDetailComponent', () => {
  let component: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;
  let eventoService: {
    obtener: ReturnType<typeof vi.fn>;
    reporte: ReturnType<typeof vi.fn>;
  };

  const mockEvento: Evento = {
    id: 1,
    titulo: 'Conferencia Angular',
    descripcion: 'Una conferencia sobre Angular',
    venueId: 1,
    venueNombre: 'Auditorio Central',
    capacidadMaxima: 100,
    fechaHoraInicio: '2025-06-30T10:00:00Z',
    fechaHoraFin: '2025-06-30T12:00:00Z',
    precioEntrada: 50,
    tipo: 'Conferencia',
    estado: 'Activo',
  };

  const mockReporte: ReporteOcupacion = {
    eventoId: 1,
    eventoTitulo: 'Conferencia Angular',
    totalEntradasVendidas: 75,
    totalEntradasDisponibles: 25,
    porcentajeOcupacion: 75,
    totalIngresos: 3750,
    estadoEvento: 1
  };

  beforeEach(async () => {
    const eventoSpy = {
      obtener: vi.fn(),
      reporte: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        EventDetailComponent,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: EventoService, useValue: eventoSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        }
      ]
    }).compileComponents();

    eventoService = eventoSpy;
    eventoService.obtener.mockReturnValue(of(mockEvento));
    eventoService.reporte.mockReturnValue(of(mockReporte));

    fixture = TestBed.createComponent(EventDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load evento and reporte on init', () => {
    fixture.detectChanges();
    expect(eventoService.obtener).toHaveBeenCalledWith(1);
    expect(eventoService.reporte).toHaveBeenCalledWith(1);
    expect(component.evento()).toEqual(mockEvento);
    expect(component.reporte()).toEqual(mockReporte);
  });

  it('should convert percentage correctly', () => {
    fixture.detectChanges();
    expect(component.porcentaje).toBe(0.75);
  });

  it('should return correct estado color', () => {
    expect(component.estadoColor('Activo')).toBe('estado-activo');
    expect(component.estadoColor('Cancelado')).toBe('estado-cancelado');
    expect(component.estadoColor('Completado')).toBe('estado-completado');
  });

  it('should handle loading state', () => {
    expect(component.cargando()).toBe(true);
    fixture.detectChanges();
    expect(component.cargando()).toBe(false);
  });
});
