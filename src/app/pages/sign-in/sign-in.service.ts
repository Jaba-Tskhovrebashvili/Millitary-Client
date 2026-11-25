import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTokenService } from '@core/auth/auth-token.service';
import { apiErrorMessage } from '@core/http/api-error';
import { finalize } from 'rxjs';
import { SignInApi } from './sign-in.api';
import { SignInRequest } from './sign-in.models';

@Injectable()
export class SignInService {
  private readonly api = inject(SignInApi);
  private readonly tokens = inject(AuthTokenService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  signIn(credentials: SignInRequest): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);

    this.api
      .signIn(credentials)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: res => {
          this.tokens.set(res.token);
          void this.router.navigate(['/personnel']);
        },
        error: err => this.error.set(apiErrorMessage(err, 'ავტორიზაცია ვერ მოხერხდა')),
      });
  }
}
