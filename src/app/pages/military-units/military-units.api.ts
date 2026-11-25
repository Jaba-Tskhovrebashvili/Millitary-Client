import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, map } from 'rxjs';
import { MilitaryUnitsPage, MilitaryUnitsResponse } from './military-units.models';

@Injectable()
export class MilitaryUnitsApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/military-units`;

  getPage(search: string, page: number): Observable<MilitaryUnitsPage> {
    let params = new HttpParams().set('page', page);
    if (search) params = params.set('search', search);
    return this.http.get<MilitaryUnitsResponse>(this.url, { params }).pipe(map(res => res.militaryUnits));
  }
}
