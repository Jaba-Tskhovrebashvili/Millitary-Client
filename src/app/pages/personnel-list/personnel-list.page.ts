import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { InfiniteScrollDirective } from '@shared/infinite-scroll/infinite-scroll.directive';
import { Subject, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { PersonnelListApi } from './personnel-list.api';
import { PersonnelListService } from './personnel-list.service';
import { RankIcons } from './personnel-list.models';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-personnel-list-page',
  imports: [RouterLink, DatePipe, PaginatorModule],
  providers: [PersonnelListService, PersonnelListApi],
  templateUrl: './personnel-list.page.html',
  styleUrl: './personnel-list.page.scss',
})
export class PersonnelListPage {
  protected readonly page = inject(PersonnelListService);
  private readonly searchInput$ = new Subject<string>();

  protected readOnly: RankIcons[] = [
    { id: 1, src: "/rank-icons/svg/01-of-9-general-of-the-army.svg" },
    { id: 2, src: "/rank-icons/svg/02-of-8-lieutenant-general.svg" },
    { id: 3, src: "/rank-icons/svg/03-of-7-major-general.svg" },
    { id: 4, src: "/rank-icons/svg/04-of-6-brigadier-general.svg" },
    { id: 5, src: "/rank-icons/svg/05-of-5-colonel.svg" },
    { id: 6, src: "/rank-icons/svg/06-of-4-lieutenant-colonel.svg" },
    { id: 7, src: "/rank-icons/svg/07-of-3-major.svg" },
    { id: 8, src: "/rank-icons/svg/08-of-2-captain.svg" },
    { id: 9, src: "/rank-icons/svg/09-of-1-senior-lieutenant.svg" },
    { id: 10, src: "/rank-icons/svg/10-of-1-lieutenant.svg" },
    { id: 11, src: "/rank-icons/svg/11-or-9-chief-sergeant.svg" },
    { id: 12, src: "/rank-icons/svg/12-or-8-master-sergeant.svg" },
    { id: 13, src: "/rank-icons/svg/13-or-7-senior-sergeant.svg" },
    { id: 14, src: "/rank-icons/svg/14-or-6-sergeant.svg" },
    { id: 15, src: "/rank-icons/svg/15-or-5-junior-sergeant.svg" },
    { id: 16, src: "/rank-icons/svg/16-or-4-specialist-corporal.svg" },
    { id: 17, src: "/rank-icons/svg/17-or-4-corporal.svg" },
    { id: 18, src: "/rank-icons/svg/18-or-3-private-first-class.svg" },
    { id: 19, src: "/rank-icons/svg/19-or-2-private.svg" }
  ];
  first: number = 0
  totalPage: number = 1;
  constructor() {
    this.first = (this.page._page() - 1) * 10;
    this.page.loadRanks();
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



  rows: number = 10;



  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    console.log("this.first", event.first)
    const currentPage = Math.floor(this.first / this.rows) + 1;

    this.page._page.set(currentPage);
    this.page.loadNext();
  }
}
