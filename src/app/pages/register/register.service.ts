import { Injectable, inject, signal } from '@angular/core';
import { apiErrorMessage } from '@core/http/api-error';
import { finalize } from 'rxjs';
import { RegisterApi } from './register.api';
import { RegisterRequest } from './register.models';

@Injectable()
export class RegisterService {
  private readonly api = inject(RegisterApi);

  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly sentMessage = signal<string | null>(null);

  register(body: RegisterRequest): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.error.set(null);

    this.api
      .sendVerificationEmail(body)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: res => this.sentMessage.set(res.message),
        error: err => this.error.set(apiErrorMessage(err)),
      });
  }
}
