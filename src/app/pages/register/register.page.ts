import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RegisterApi } from './register.api';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  providers: [RegisterService, RegisterApi],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
})
export class RegisterPage {
  protected readonly page = inject(RegisterService);

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    surname: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.page.register({ name: v.name.trim(), surname: v.surname.trim(), email: v.email.trim() });
  }
}
