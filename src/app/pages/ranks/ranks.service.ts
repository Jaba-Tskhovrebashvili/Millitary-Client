import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { apiErrorMessage } from '@core/http/api-error';
import { Subject, catchError, of, switchMap, tap } from 'rxjs';
import { RanksApi } from './ranks.api';
import { Rank } from './ranks.models';

@Injectable()
export class RanksService {
  private readonly api = inject(RanksApi);
  private readonly chunk = 30;
  private readonly search$ = new Subject<string>();

  private readonly _all = signal<Rank[]>([]);
  private readonly _visible = signal(this.chunk);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly total = computed(() => this._all().length);
  readonly items = computed(() => this._all().slice(0, this._visible()));
  readonly hasMore = computed(() => this._visible() < this._all().length);

  constructor() {
    this.search$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap(term =>
          this.api.search(term).pipe(
            catchError(err => {
              this.error.set(apiErrorMessage(err));
              return of<Rank[]>([]);
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe(list => {
        this._all.set(list);
        this._visible.set(this.chunk);
        this.loading.set(false);
      });
  }

  search(term: string): void {
    this.search$.next(term.trim());
  }

  showMore(): void {
    if (this.hasMore()) this._visible.update(v => v + this.chunk);
  }
}
