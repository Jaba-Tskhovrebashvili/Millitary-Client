import { Component, OnInit, computed, effect, inject, input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PersonnelFormApi } from './personnel-form.api';
import { PersonnelFormService } from './personnel-form.service';

@Component({
  selector: 'app-personnel-form-page',
  imports: [ReactiveFormsModule, RouterLink],
  providers: [PersonnelFormService, PersonnelFormApi],
  templateUrl: './personnel-form.page.html',
  styleUrl: './personnel-form.page.scss',
})
export class PersonnelFormPage implements OnInit {
  readonly id = input<string>();

  protected readonly page = inject(PersonnelFormService);
  protected readonly personnelId = computed(() => {
    const n = Number(this.id());
    return Number.isInteger(n) && n > 0 ? n : null;
  });
  protected readonly isEdit = computed(() => this.personnelId() !== null);

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    personalNumber: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    dateOfBirth: ['', Validators.required],
    rankId: [0, Validators.min(1)],
    phoneNumber: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    enlistmentDate: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const rec = this.page.record();
      if (!rec) return;
      this.form.patchValue({
        name: rec.name,
        surname: rec.surname,
        email: rec.email,
        personalNumber: rec.personalNumber,
        dateOfBirth: rec.dateOfBirth?.slice(0, 10) ?? '',
        rankId: rec.rankId,
        phoneNumber: rec.phoneNumber,
        enlistmentDate: rec.enlistmentDate?.slice(0, 10) ?? '',
      });
    });
  }

  ngOnInit(): void {
    this.page.init(this.personnelId());
  }

  protected invalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.touched && c.invalid;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.page.save(this.personnelId(), {
      ...v,
      name: v.name.trim(),
      surname: v.surname.trim(),
      email: v.email.trim(),
      rankId: Number(v.rankId),
      isActive: true,
    });
  }
}
