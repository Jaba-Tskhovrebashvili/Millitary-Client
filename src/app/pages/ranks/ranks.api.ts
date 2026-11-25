import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, map } from 'rxjs';
import { Rank, RanksResponse } from './ranks.models';

@Injectable()
export class RanksApi {
  private readonly http = inject(HttpClient);

  search(term: string): Observable<Rank[]> {
    const params = term ? new HttpParams().set('search', term) : undefined;
    return this.http.get<RanksResponse>(`${environment.apiUrl}/ranks`, { params }).pipe(map(res => res.ranks));
  }
}
