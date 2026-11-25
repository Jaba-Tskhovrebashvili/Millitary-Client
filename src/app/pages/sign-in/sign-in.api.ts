import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { SignInRequest, SignInResponse } from './sign-in.models';

@Injectable()
export class SignInApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/Admin`;

  signIn(body: SignInRequest): Observable<SignInResponse> {
    return this.http.post<SignInResponse>(`${this.url}/sign-in`, body);
  }
}
