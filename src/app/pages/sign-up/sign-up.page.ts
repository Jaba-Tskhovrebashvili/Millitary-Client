import { Component, inject, input } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SignUpApi } from './sign-up.api';
import { PASSWORD_PATTERN } from './sign-up.models';
import { SignUpService } from './sign-up.service';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const { password, confirmPassword } = group.value as { password: string; confirmPassword: string };
  return password === confirmPassword ? null : { mismatch: true };
}

@Component({
  selector: 'app-sign-up-page',
  imports: [ReactiveFormsModule, RouterLink],
  providers: [SignUpService, SignUpApi],
  templateUrl: './sign-up.page.html',
  styleUrl: './sign-up.page.scss',
})
export class SignUpPage {
  readonly token = input<string>();

  protected readonly page = inject(SignUpService);

  protected readonly form = inject(NonNullableFormBuilder).group(
    {
      password: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch },
  );

  protected submit(): void {
    const token = this.token();
    if (!token) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.page.signUp(token, this.form.getRawValue());
  }
}
