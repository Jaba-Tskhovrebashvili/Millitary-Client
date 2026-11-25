import { Injectable, computed, inject, signal } from '@angular/core';
import { apiErrorMessage } from '@core/http/api-error';
import { Subscription, finalize } from 'rxjs';
import { PersonnelListApi } from './personnel-list.api';
import { PersonnelListItem, RankOption } from './personnel-list.models';


@Injectable()
export class PersonnelListService {
  private readonly api = inject(PersonnelListApi);
  private request?: Subscription;
  private term = '';

  private readonly _items = signal<PersonnelListItem[]>([]);
  public readonly _page = signal(Number(localStorage.getItem('currentPage') ?? 0));
  public readonly _totalPages = signal(Number(localStorage.getItem('personTotalPage') ?? 1));
  private readonly _count = signal(0);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _ranks = signal<RankOption[]>([]);

  readonly items = this._items.asReadonly();
  readonly page = this._page.asReadonly();
  readonly totalPages = this._totalPages.asReadonly();
  readonly count = this._count.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  //readonly hasMore = computed(() => this._page() < this._totalPages());
  readonly firstLoad = computed(() => this._loading() && this._page() === 0);


  loadRanks(): void {
    this.api.getRanks().subscribe({ next: ranks => this._ranks.set(ranks), error: () => { } });
  }

  search(term: string): void {
    this.term = term.trim();
    this.request?.unsubscribe();
    this._items.set([]);
    if (this.term.length !== 0) {
      this._page.set(0);
      this._totalPages.set(1);
    }
    this._count.set(0);
    this._error.set(null);
    this.loadNext();
  }

  loadNext(): void {
    if (this._loading()) return;
    const next = this._page() === 0 ? 1 : this._page();
    this._loading.set(true);
    this._error.set(null);

    this.request = this.api
      .getPage(this.term, next)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: res => {
          this._items.set([...res.personnels]);
          this._page.set(next);
          this._totalPages.set(res.totalPages);
          localStorage.setItem('personTotalPage', String(res.totalPages));
          this._count.set(res.count);
          localStorage.setItem('currentPage', String(next))
        },
        error: err => this._error.set(apiErrorMessage(err)),
      });
  }
}
