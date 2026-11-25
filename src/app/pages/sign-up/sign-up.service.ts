import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { apiErrorMessage } from '@core/http/api-error';
import { finalize } from 'rxjs';
import { SignUpApi } from './sign-up.api';
import { SignUpRequest } from './sign-up.models';

@Injectable()
export class SignUpService {
  private readonly api = inject(SignUpApi);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly done = signal<string | null>(null);

  signUp(token: string, body: SignUpRequest): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);

    this.api
      .signUp(token, body)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: res => {
          this.done.set(res.message);
          setTimeout(() => void this.router.navigate(['/sign-in']), 1800);
        },
        error: err => this.error.set(apiErrorMessage(err)),
      });
  }
}
