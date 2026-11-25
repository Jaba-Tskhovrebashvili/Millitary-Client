import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InfiniteScrollDirective } from '@shared/infinite-scroll/infinite-scroll.directive';
import { Subject, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { MilitaryUnitsApi } from './military-units.api';
import { MilitaryUnitsService } from './military-units.service';

@Component({
  selector: 'app-military-units-page',
  imports: [InfiniteScrollDirective],
  providers: [MilitaryUnitsService, MilitaryUnitsApi],
  templateUrl: './military-units.page.html',
  styleUrl: './military-units.page.scss',
})
export class MilitaryUnitsPage {
  protected readonly page = inject(MilitaryUnitsService);
  private readonly searchInput$ = new Subject<string>();

  constructor() {
    this.searchInput$
      .pipe(
        debounceTime(400),
        map(v => v.trim()),
        startWith(''),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe(term => this.page.search(term));
  }

  protected onSearch(value: string): void {
    this.searchInput$.next(value);
  }
}
