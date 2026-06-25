import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EventListComponent } from './event-list';
import { EventoService } from '../../../core/services/evento.service';
import { VenueService } from '../../../core/services/venue.service';
import { of } from 'rxjs';
import { Evento } from '../../../core/models/evento.model';
import { Venue } from '../../../core/models/venue.model';
import { vi } from 'vitest';
import { RouterTestingModule } from '@angular/router/testing';

describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;
  let eventoService: { listar: ReturnType<typeof vi.fn> };
  let venueService: { listar: ReturnType<typeof vi.fn> };

  const mockEventos: Evento[] = [
    {
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
    },
  ];

  const mockVenues: Venue[] = [
    { id: 1, nombre: 'Auditorio Central', capacidad: 200, ciudad: 'Bogotá' }
  ];

  beforeEach(async () => {
    const eventoSpy = {
      listar: vi.fn()
    };
    const venueSpy = {
      listar: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [EventListComponent, HttpClientTestingModule, NoopAnimationsModule, RouterTestingModule],
      providers: [
        { provide: EventoService, useValue: eventoSpy },
        { provide: VenueService, useValue: venueSpy }
      ]
    }).compileComponents();

    eventoService = eventoSpy;
    venueService = venueSpy;

    eventoService.listar.mockReturnValue(of(mockEventos));
    venueService.listar.mockReturnValue(of(mockVenues));

    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load eventos on init', () => {
    fixture.detectChanges();
    expect(eventoService.listar).toHaveBeenCalled();
    expect(component.eventos()).toEqual(mockEventos);
  });

  it('should load venues on init', () => {
    fixture.detectChanges();
    expect(venueService.listar).toHaveBeenCalled();
    expect(component.venues()).toEqual(mockVenues);
  });

  it('should filter eventos by title', () => {
    fixture.detectChanges();
    component.filtroForm.patchValue({ titulo: 'Angular' });
    component.cargar();

    expect(eventoService.listar).toHaveBeenCalledWith(
      expect.objectContaining({ titulo: 'Angular' })
    );
  });

  it('should return correct estado color', () => {
    expect(component.estadoColor('Activo')).toBe('estado-activo');
    expect(component.estadoColor('Cancelado')).toBe('estado-cancelado');
    expect(component.estadoColor('Completado')).toBe('estado-completado');
  });

  it('should return correct tipo label', () => {
    expect(component.tipoLabel('Conferencia')).toBe('Conferencia');
    expect(component.tipoLabel('Taller')).toBe('Taller');
    expect(component.tipoLabel('Concierto')).toBe('Concierto');
  });

  it('should clear filters and reload', () => {
    fixture.detectChanges();
    component.filtroForm.patchValue({ titulo: 'Test' });
    component.limpiarFiltros();

    expect(component.filtroForm.value.titulo).toBeNull();
    expect(eventoService.listar).toHaveBeenCalled();
  });
});
