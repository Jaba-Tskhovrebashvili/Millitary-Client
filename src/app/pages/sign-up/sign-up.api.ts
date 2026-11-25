import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { MessageResponse, SignUpRequest } from './sign-up.models';

@Injectable()
export class SignUpApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/Admin`;

  signUp(token: string, body: SignUpRequest): Observable<MessageResponse> {
    const params = new HttpParams().set('token', token);
    return this.http.post<MessageResponse>(`${this.url}/sign-up`, body, { params });
  }
}
