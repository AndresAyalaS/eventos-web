import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventoService } from './evento.service';
import { Evento, CrearEventoRequest } from '../models/evento.model';
import { environment } from '../../../environments/environment';

describe('EventoService', () => {
  let service: EventoService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/Events`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventoService],
    });
    service = TestBed.inject(EventoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should list eventos with filters', (done) => {
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

    service.listar({ tipo: 'Conferencia' }).subscribe((data) => {
      expect(data).toEqual(mockEventos);
      expect(data.length).toBe(1);
    });

    const req = httpMock.expectOne((r) => r.url === `${baseUrl}/search` && r.params.has('Tipo'));
    expect(req.request.method).toBe('GET');
    req.flush(mockEventos);
  });

  it('should get a single evento', (done) => {
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

    service.obtener(1).subscribe((data) => {
      expect(data).toEqual(mockEvento);
      expect(data.id).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvento);
  });

  it('should create an evento', (done) => {
    const createDto: CrearEventoRequest = {
      titulo: 'Nuevo Evento',
      descripcion: 'Descripción del nuevo evento',
      venueId: 1,
      capacidadMaxima: 50,
      fechaHoraInicio: '2025-07-15T14:00:00Z',
      fechaHoraFin: '2025-07-15T16:00:00Z',
      precioEntrada: 30,
      tipo: 'Taller',
    };

    const mockResponse: Evento = { id: 2, ...createDto, venueNombre: 'Auditorio Central', estado: 'Activo' };

    service.crear(createDto).subscribe((data) => {
      expect(data.id).toBe(2);
      expect(data.titulo).toBe('Nuevo Evento');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createDto);
    req.flush(mockResponse);
  });

  it('should get occupancy report', (done) => {
    const mockReporte = {
      eventoId: 1,
      tituloEvento: 'Conferencia Angular',
      totalVendidas: 75,
      totalDisponibles: 25,
      porcentajeOcupacion: 75,
      totalIngresos: 3750,
      estadoEvento: 'Activo',
    };

    service.reporte(1).subscribe((data) => {
      expect(data.porcentajeOcupacion).toBe(75);
      expect(data.totalIngresos).toBe(3750);
    });

    const req = httpMock.expectOne(`${baseUrl}/1/occupancy`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReporte);
  });
});
