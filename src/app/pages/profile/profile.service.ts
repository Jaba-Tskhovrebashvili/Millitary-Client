import { Injectable, inject, signal } from '@angular/core';
import { AuthTokenService } from '@core/auth/auth-token.service';
import { apiErrorMessage } from '@core/http/api-error';
import { finalize } from 'rxjs';
import { ProfileApi } from './profile.api';
import { AdminProfile } from './profile.models';

@Injectable()
export class ProfileService {
  private readonly api = inject(ProfileApi);
  private readonly tokens = inject(AuthTokenService);

  readonly profile = signal<AdminProfile | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  load(): void {
    const adminId = this.tokens.adminId();
    if (!adminId) {
      this.error.set('ადმინის იდენტიფიკატორი ვერ მოიძებნა');
      return;
    }
    this.loading.set(true);
    this.api
      .getProfile(adminId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: p => this.profile.set(p),
        error: err => this.error.set(apiErrorMessage(err)),
      });
  }
}
