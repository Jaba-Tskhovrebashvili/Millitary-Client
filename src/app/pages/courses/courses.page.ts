import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InfiniteScrollDirective } from '@shared/infinite-scroll/infinite-scroll.directive';
import { Subject, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { CoursesApi } from './courses.api';
import { CoursesService } from './courses.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-courses-page',
  imports: [InfiniteScrollDirective, RouterLink],
  providers: [CoursesService, CoursesApi],
  templateUrl: './courses.page.html',
  styleUrl: './courses.page.scss',
})
export class CoursesPage {
  protected readonly page = inject(CoursesService);
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
