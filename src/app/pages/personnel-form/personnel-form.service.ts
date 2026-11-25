import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { apiErrorMessage } from '@core/http/api-error';
import { finalize } from 'rxjs';
import { PersonnelFormApi } from './personnel-form.api';
import { PersonnelPayload, PersonnelRecord, RankOption } from './personnel-form.models';

@Injectable()
export class PersonnelFormService {
  private readonly api = inject(PersonnelFormApi);
  private readonly router = inject(Router);

  readonly ranks = signal<RankOption[]>([]);
  readonly record = signal<PersonnelRecord | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  init(id: number | null): void {
    this.api.getRanks().subscribe({
      next: ranks => this.ranks.set(ranks),
      error: err => this.error.set(apiErrorMessage(err)),
    });

    if (id === null) return;
    this.loading.set(true);
    this.api
      .getById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: rec => this.record.set(rec),
        error: err => this.error.set(apiErrorMessage(err, 'პერსონალი ვერ მოიძებნა')),
      });
  }

  save(id: number | null, body: PersonnelPayload): void {
    if (this.saving()) return;
    this.saving.set(true);
    this.error.set(null);

    const request$ = id === null ? this.api.create(body) : this.api.update(id, body);
    request$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => void this.router.navigate(id === null ? ['/personnel'] : ['/personnel', id]),
      error: err => this.error.set(apiErrorMessage(err)),
    });
  }
}
