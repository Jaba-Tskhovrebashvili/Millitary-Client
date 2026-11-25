import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { MessageResponse, RegisterRequest } from './register.models';

@Injectable()
export class RegisterApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/admin`;

  sendVerificationEmail(body: RegisterRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.url}/verify-email`, body);
  }
}
