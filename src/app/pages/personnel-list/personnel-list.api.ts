import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, map } from 'rxjs';
import { PersonnelPage, PersonnelPageResponse, RankOption, RanksResponse } from './personnel-list.models';

@Injectable()
export class PersonnelListApi {
  private readonly http = inject(HttpClient);

  getPage(search: string, page: number): Observable<PersonnelPage> {
    let params = new HttpParams().set('page', page);
    if (search) params = params.set('search', search);
    return this.http
      .get<PersonnelPageResponse>(`${environment.apiUrl}/personnel`, { params })
      .pipe(map(res => res.personnel));
  }

  getRanks(): Observable<RankOption[]> {
    return this.http.get<RanksResponse>(`${environment.apiUrl}/ranks`).pipe(map(res => res.ranks));
  }
}
