import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, map } from 'rxjs';
import {
  MessageResponse,
  PersonnelPayload,
  PersonnelRecord,
  PersonnelRecordResponse,
  RankOption,
  RanksResponse,
} from './personnel-form.models';

@Injectable()
export class PersonnelFormApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/personnel`;

  getRanks(): Observable<RankOption[]> {
    return this.http.get<RanksResponse>(`${environment.apiUrl}/ranks`).pipe(map(res => res.ranks));
  }

  getById(id: number): Observable<PersonnelRecord> {
    return this.http.get<PersonnelRecordResponse>(`${this.url}/id:int`,{ params: { id }}).pipe(map(res => res.personnel));
  }

  create(body: PersonnelPayload): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(this.url, body);
  }

  update(id: number, body: PersonnelPayload): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`${this.url}/${id}`, body);
  }
}
