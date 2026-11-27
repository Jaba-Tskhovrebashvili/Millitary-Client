import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, map } from 'rxjs';
import { Course, CoursesResponse } from '../courses/courses.models';

@Injectable()
export class CoursesFormApi {
    private readonly http = inject(HttpClient);

    save(Course: Course): Observable<Course[]> {

        return this.http
            .post<CoursesResponse>(`${environment.apiUrl}/courses`, Course)
            .pipe(map(res => res.courses ?? res.ranks ?? []));
    }
}