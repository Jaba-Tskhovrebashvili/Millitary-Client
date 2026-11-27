import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { apiErrorMessage } from '@core/http/api-error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CoursesFormApi } from "./courses-form.api";
import { Course, CoursesResponse } from '../courses/courses.models';
import { HttpErrorResponse } from '@angular/common/http';
@Injectable()
export class CoursesFormService {
    private readonly router = inject(Router);
    private readonly coursesFormApi = inject(CoursesFormApi);
    private readonly destroyRef = inject(DestroyRef);
    readonly loading = signal(false);

    readonly saving = signal(false);
    readonly error = signal<string | null>(null);
    save(course: Course) {
        if (this.saving()) return;

        this.saving.set(true);
        this.loading.set(true);
        this.error.set(null);

        this.coursesFormApi
            .save(course)
            .pipe(
                finalize(() => (this.saving.set(false), this.loading.set(false))),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: () => {this.router.navigate(['/courses'])},
                error: (err: HttpErrorResponse) =>
                    this.error.set(err.error?.message ?? 'დაფიქსირდა შეცდომა.'),
            });
    }
}