import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReservaService } from './reserva.service';
import { Reserva, CrearReservaRequest } from '../models/reserva.model';
import { environment } from '../../../environments/environment';

describe('ReservaService', () => {
  let service: ReservaService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/Reservations`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReservaService],
    });
    service = TestBed.inject(ReservaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create a reservation', () => {
    const createDto: CrearReservaRequest = {
      eventoId: 1,
      cantidad: 2,
      nombreComprador: 'Juan Pérez',
      emailComprador: 'juan@example.com',
    };

    const mockResponse: Reserva = {
      id: 1,
      eventoId: 1,
      eventoTitulo: 'titulo del evento',
      cantidad: 2,
      nombreComprador: 'Juan Pérez',
      emailComprador: 'juan@example.com',
      estado: 'PendientePago',
      fechaCreacion: new Date().toISOString(),
    };

    service.crear(createDto).subscribe((data) => {
      expect(data.id).toBe(1);
      expect(data.estado).toBe('PendientePago');
      expect(data.cantidad).toBe(2);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should confirm payment', () => {
    const mockResponse: Reserva = {
      id: 1,
      eventoId: 1,
      eventoTitulo: 'titulo del evento',
      cantidad: 2,
      nombreComprador: 'Juan Pérez',
      emailComprador: 'juan@example.com',
      estado: 'Confirmada',
      codigoReserva: 'EV-123456',
      fechaCreacion: new Date().toISOString(),
    };

    service.confirmarPago(1).subscribe((data) => {
      expect(data.estado).toBe('Confirmada');
      expect(data.codigoReserva).toBe('EV-123456');
    });

    const req = httpMock.expectOne(`${baseUrl}/1/confirm-payment`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should cancel a reservation', () => {
    const mockResponse: Reserva = {
      id: 1,
      eventoId: 1,
      eventoTitulo: 'titulo del evento',
      cantidad: 2,
      nombreComprador: 'Juan Pérez',
      emailComprador: 'juan@example.com',
      estado: 'Cancelada',
      fechaCancelacion: new Date().toISOString(),
      fechaCreacion: new Date().toISOString(),
    };

    service.cancelar(1).subscribe((data) => {
      expect(data.estado).toBe('Cancelada');
      expect(data.fechaCancelacion).toBeDefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/1/cancel`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get a reservation', () => {
    const mockReserva: Reserva = {
      id: 1,
      eventoId: 1,
      eventoTitulo: 'titulo del evento',
      cantidad: 2,
      nombreComprador: 'Juan Pérez',
      emailComprador: 'juan@example.com',
      estado: 'Confirmada',
      codigoReserva: 'EV-123456',
      fechaCreacion: new Date().toISOString(),
    };

    service.obtener(1).subscribe((data) => {
      expect(data.id).toBe(1);
      expect(data.nombreComprador).toBe('Juan Pérez');
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReserva);
  });
});
