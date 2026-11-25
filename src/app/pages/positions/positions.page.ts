import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InfiniteScrollDirective } from '@shared/infinite-scroll/infinite-scroll.directive';
import { Subject, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { PositionsApi } from './positions.api';
import { PositionsService } from './positions.service';

@Component({
  selector: 'app-positions-page',
  imports: [InfiniteScrollDirective],
  providers: [PositionsService, PositionsApi],
  templateUrl: './positions.page.html',
  styleUrl: './positions.page.scss',
})
export class PositionsPage {
  protected readonly page = inject(PositionsService);
  private readonly searchInput$ = new Subject<string>();

  constructor() {
    this.searchInput$
      .pipe(debounceTime(400), map(v => v.trim()), startWith(''), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(term => this.page.search(term));
  }

  protected onSearch(value: string): void {
    this.searchInput$.next(value);
  }
}
