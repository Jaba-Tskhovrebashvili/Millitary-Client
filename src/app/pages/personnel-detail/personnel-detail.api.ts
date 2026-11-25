import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, map } from 'rxjs';
import {
  Assignment,
  AssignmentPayload,
  AssignmentsResponse,
  MessageResponse,
  Option,
  PersonnelCourse,
  PersonnelCoursePayload,
  PersonnelCourseUpdate,
  PersonnelCoursesResponse,
  PersonnelProfile,
  PersonnelProfileResponse,
  UnitsPage,
} from './personnel-detail.models';

@Injectable()
export class PersonnelDetailApi {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  getById(id: number): Observable<PersonnelProfile> {
    return this.http
      .get<PersonnelProfileResponse>(`${this.api}/personnel/id:int`, { params: { id } })
      .pipe(map(response => response.personnel));
  }

  deactivate(id: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.api}/personnel/${id}`);
  }

  getAssignments(personnelId: number): Observable<Assignment[]> {
    const params = new HttpParams().set('personnelId', personnelId);
    return this.http
      .get<AssignmentsResponse>(`${this.api}/personnel/assignments`, { params })
      .pipe(map(response => response.personnelAssaignments));
  }

  addAssignment(body: AssignmentPayload): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.api}/personnel/assignments`, body);
  }

  updateAssignment(id: number, body: AssignmentPayload): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`${this.api}/personnel/assignments/${id}`, body);
  }

  getCourses(personnelId: number): Observable<PersonnelCourse[]> {
    return this.http
      .get<PersonnelCoursesResponse>(`${this.api}/personnel/courses/${personnelId}`)
      .pipe(map(response => response.personnelCourses));
  }

  addCourse(body: PersonnelCoursePayload): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.api}/personnel/courses`, body);
  }

  updateCourse(id: number, body: PersonnelCourseUpdate): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`${this.api}/personnel/courses/${id}`, body);
  }

  searchUnits(search: string, page: number): Observable<UnitsPage> {
    let params = new HttpParams().set('page', page);
    if (search) {
      params = params.set('search', search);
    }

    return this.http
      .get<{ militaryUnits: UnitsPage }>(`${this.api}/military-units`, { params })
      .pipe(map(response => response.militaryUnits));
  }

  getPositions(): Observable<Option[]> {
    return this.http
      .get<{ positions: Option[] }>(`${this.api}/positions`)
      .pipe(map(response => response.positions));
  }

  getCourseCatalog(): Observable<Option[]> {
    return this.http
      .get<{ courses?: Option[]; ranks?: Option[] }>(`${this.api}/courses`)
      .pipe(map(response => response.courses ?? response.ranks ?? []));
  }
}
