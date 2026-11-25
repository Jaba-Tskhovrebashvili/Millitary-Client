import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, map } from 'rxjs';
import { Course, CoursesResponse } from './courses.models';

@Injectable()
export class CoursesApi {
  private readonly http = inject(HttpClient);

  search(term: string): Observable<Course[]> {
    const params = term ? new HttpParams().set('search', term) : undefined;
    return this.http
      .get<CoursesResponse>(`${environment.apiUrl}/courses`, { params })
      .pipe(map(res => res.courses ?? res.ranks ?? []));
  }
}
