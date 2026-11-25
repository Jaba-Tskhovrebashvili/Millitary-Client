import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, map } from 'rxjs';
import { Position, PositionsResponse } from './positions.models';

@Injectable()
export class PositionsApi {
  private readonly http = inject(HttpClient);

  search(term: string): Observable<Position[]> {
    const params = term ? new HttpParams().set('search', term) : undefined;
    return this.http
      .get<PositionsResponse>(`${environment.apiUrl}/positions`, { params })
      .pipe(map(res => res.positions));
  }
}
