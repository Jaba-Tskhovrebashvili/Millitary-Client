import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InfiniteScrollDirective } from '@shared/infinite-scroll/infinite-scroll.directive';
import { Subject, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { RanksApi } from './ranks.api';
import { RanksService } from './ranks.service';

@Component({
  selector: 'app-ranks-page',
  imports: [InfiniteScrollDirective],
  providers: [RanksService, RanksApi],
  templateUrl: './ranks.page.html',
  styleUrl: './ranks.page.scss',
})
export class RanksPage {
  protected readonly page = inject(RanksService);
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
