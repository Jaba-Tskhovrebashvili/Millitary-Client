import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, map } from 'rxjs';
import { AdminProfile, ProfileResponse } from './profile.models';

@Injectable()
export class ProfileApi {
  private readonly http = inject(HttpClient);

  getProfile(adminId: number): Observable<AdminProfile> {
    return this.http
      .get<ProfileResponse>(`${environment.apiUrl}/admin/my-profile/${adminId}`)
      .pipe(map(res => res.profile));
  }
}
