import { Component, OnInit, computed, effect, inject, input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CoursesFormApi } from './courses-form.api';
import { CoursesFormService } from './courses-form.service';


@Component({
    selector: 'app-courses-form-page',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    providers: [CoursesFormService, CoursesFormApi],
    templateUrl: './courses-form.page.html',
    styleUrl: './courses-form.page.scss',
})

export class CoursesFormPage {
    protected readonly page = inject(CoursesFormService);


    protected readonly form = inject(NonNullableFormBuilder).group({
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        Description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        DurationInWeeks: [1, [Validators.required]],
        IsActive: [true, [Validators.required]]
    });

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
        this.page.save({
            name: v.name.trim(),
            description: v.Description.trim(),
            durationInWeeks: v.DurationInWeeks,
            isActive: v.IsActive,
        });
    }

}