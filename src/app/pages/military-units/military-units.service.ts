import { Injectable, computed, inject, signal } from '@angular/core';
import { apiErrorMessage } from '@core/http/api-error';
import { Subscription, finalize } from 'rxjs';
import { MilitaryUnitsApi } from './military-units.api';
import { MilitaryUnit } from './military-units.models';

@Injectable()
export class MilitaryUnitsService {
  private readonly api = inject(MilitaryUnitsApi);
  private request?: Subscription;
  private term = '';

  private readonly _items = signal<MilitaryUnit[]>([]);
  private readonly _page = signal(0);
  private readonly _totalPages = signal(1);
  private readonly _count = signal(0);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly items = this._items.asReadonly();
  readonly page = this._page.asReadonly();
  readonly totalPages = this._totalPages.asReadonly();
  readonly count = this._count.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasMore = computed(() => this._page() < this._totalPages());
  readonly firstLoad = computed(() => this._loading() && this._page() === 0);

  search(term: string): void {
    this.term = term.trim();
    this.request?.unsubscribe();
    this._items.set([]);
    this._page.set(0);
    this._totalPages.set(1);
    this._count.set(0);
    this._error.set(null);
    this.loadNext();
  }

  loadNext(): void {
    if (this._loading() || !this.hasMore()) return;

    const next = this._page() + 1;
    this._loading.set(true);
    this._error.set(null);

    this.request = this.api
      .getPage(this.term, next)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: res => {
          const seen = new Set(this._items().map(u => u.id));
          this._items.update(list => [...list, ...res.militaryUnits.filter(u => !seen.has(u.id))]);
          this._page.set(next);
          this._totalPages.set(res.totalPages);
          this._count.set(res.count);
        },
        error: err => this._error.set(apiErrorMessage(err)),
      });
  }
}
