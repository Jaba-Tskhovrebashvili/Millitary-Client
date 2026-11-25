import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SignInApi } from './sign-in.api';
import { SignInService } from './sign-in.service';

@Component({
  selector: 'app-sign-in-page',
  imports: [ReactiveFormsModule, RouterLink],
  providers: [SignInService, SignInApi],
  templateUrl: './sign-in.page.html',
  styleUrl: './sign-in.page.scss',
})
export class SignInPage {
  protected readonly page = inject(SignInService);

  protected readonly form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.page.signIn(this.form.getRawValue());
  }
}
