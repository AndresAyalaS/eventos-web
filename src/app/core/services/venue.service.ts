import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Venue } from '../models/venue.model';

@Injectable({ providedIn: 'root' })
export class VenueService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/Venues`;

  listar(): Observable<Venue[]> {
    return this.http.get<Venue[]>(this.base);
  }
}
