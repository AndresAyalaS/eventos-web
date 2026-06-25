import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VenueService } from './venue.service';
import { Venue } from '../models/venue.model';
import { environment } from '../../../environments/environment';

describe('VenueService', () => {
  let service: VenueService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/Venues`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VenueService]
    });
    service = TestBed.inject(VenueService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should list all venues', (done) => {
    const mockVenues: Venue[] = [
      { id: 1, nombre: 'Auditorio Central', capacidad: 200, ciudad: 'Bogotá' },
      { id: 2, nombre: 'Sala Norte', capacidad: 50, ciudad: 'Bogotá' },
      { id: 3, nombre: 'Arena Sur', capacidad: 500, ciudad: 'Medellín' }
    ];

    service.listar().subscribe((data) => {
      expect(data.length).toBe(3);
      expect(data[0].nombre).toBe('Auditorio Central');
      expect(data[0].capacidad).toBe(200);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockVenues);
  });

  it('should handle empty venues list', (done) => {
    service.listar().subscribe((data) => {
      expect(data.length).toBe(0);
      expect(Array.isArray(data)).toBe(true);
    });

    const req = httpMock.expectOne(baseUrl);
    req.flush([]);
  });
});
