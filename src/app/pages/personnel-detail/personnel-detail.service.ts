import { Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { apiErrorMessage } from '@core/http/api-error';
import { Observable, Subject, Subscription, debounceTime, finalize } from 'rxjs';
import { PersonnelDetailApi } from './personnel-detail.api';
import {
  Assignment,
  AssignmentPayload,
  CourseResult,
  Option,
  PersonnelCourse,
  PersonnelCoursePayload,
  PersonnelProfile,
} from './personnel-detail.models';

export type DetailTab = 'assignments' | 'courses';

@Injectable()
export class PersonnelDetailService {
  private readonly api = inject(PersonnelDetailApi);
  private readonly router = inject(Router);
  private personnelId = 0;

  readonly profile = signal<PersonnelProfile | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly tab = signal<DetailTab>('assignments');

  readonly assignments = signal<Assignment[]>([]);
  readonly assignmentsLoading = signal(false);

  readonly courses = signal<PersonnelCourse[]>([]);
  readonly coursesLoading = signal(false);

  readonly saving = signal(false);
  readonly actionError = signal<string | null>(null);
  readonly flash = signal<string | null>(null);

  readonly positionOptions = signal<Option[]>([]);
  readonly courseOptions = signal<Option[]>([]);

  readonly unitOptions = signal<Option[]>([]);
  readonly unitsLoading = signal(false);
  private unitSearch = '';
  private unitPage = 0;
  private unitTotalPages = 1;
  private unitRequest?: Subscription;
  private readonly unitSearch$ = new Subject<string>();

  constructor() {
    this.unitSearch$
      .pipe(debounceTime(350), takeUntilDestroyed())
      .subscribe(search => this.reloadUnits(search));
  }

  load(id: number): void {
    this.personnelId = id;
    this.loading.set(true);
    this.api
      .getById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: profile => this.profile.set(profile),
        error: err => this.error.set(apiErrorMessage(err, 'პერსონალი ვერ მოიძებნა')),
      });
    this.loadAssignments();
    this.loadCourses();
  }

  selectTab(tab: DetailTab): void {
    this.tab.set(tab);
    this.actionError.set(null);
  }

  loadAssignments(): void {
    this.assignmentsLoading.set(true);
    this.api
      .getAssignments(this.personnelId)
      .pipe(finalize(() => this.assignmentsLoading.set(false)))
      .subscribe({
        next: list => this.assignments.set([...list].sort((a, b) => b.startDate.localeCompare(a.startDate))),
        error: err => this.actionError.set(apiErrorMessage(err)),
      });
  }

  prepareAssignmentForm(): void {
    this.actionError.set(null);
    if (this.positionOptions().length === 0) {
      this.api.getPositions().subscribe({
        next: positions => this.positionOptions.set(positions),
        error: err => this.actionError.set(apiErrorMessage(err)),
      });
    }
    this.reloadUnits('');
  }

  searchUnits(search: string): void {
    this.unitSearch$.next(search.trim());
  }

  loadMoreUnits(): void {
    if (this.unitsLoading() || this.unitPage >= this.unitTotalPages) {
      return;
    }

    const nextPage = this.unitPage + 1;
    this.unitsLoading.set(true);

    this.unitRequest = this.api
      .searchUnits(this.unitSearch, nextPage)
      .pipe(finalize(() => this.unitsLoading.set(false)))
      .subscribe({
        next: result => {
          const knownIds = new Set(this.unitOptions().map(unit => unit.id));
          const newUnits = result.militaryUnits.filter(unit => !knownIds.has(unit.id));
          this.unitOptions.update(units => [...units, ...newUnits]);
          this.unitPage = nextPage;
          this.unitTotalPages = result.totalPages;
        },
        error: () => {
          this.unitTotalPages = this.unitPage;
        },
      });
  }

  addAssignment(form: Omit<AssignmentPayload, 'personnelId'>, onSaved: () => void): void {
    this.save(this.api.addAssignment({ ...form, personnelId: this.personnelId }), () => {
      onSaved();
      this.loadAssignments();
    });
  }

  endAssignment(assignment: Assignment): void {
    this.save(
      this.api.updateAssignment(assignment.id, {
        personnelId: assignment.personnelId,
        militaryUnitId: assignment.militaryUnitId,
        positionId: assignment.positionId,
        startDate: assignment.startDate,
        endDate: today(),
        isCurrent: false,
      }),
      () => this.loadAssignments(),
    );
  }

  loadCourses(): void {
    this.coursesLoading.set(true);
    this.api
      .getCourses(this.personnelId)
      .pipe(finalize(() => this.coursesLoading.set(false)))
      .subscribe({
        next: list => this.courses.set(list),
        error: err => this.actionError.set(apiErrorMessage(err)),
      });
  }

  prepareCourseForm(): void {
    this.actionError.set(null);
    if (this.courseOptions().length === 0) {
      this.api.getCourseCatalog().subscribe({
        next: courses => this.courseOptions.set(courses),
        error: err => this.actionError.set(apiErrorMessage(err)),
      });
    }
  }

  addCourse(form: Omit<PersonnelCoursePayload, 'personnelId'>, onSaved: () => void): void {
    this.save(this.api.addCourse({ ...form, personnelId: this.personnelId }), () => {
      onSaved();
      this.loadCourses();
    });
  }

  setCourseResult(course: PersonnelCourse, result: CourseResult): void {
    const completionDate = result === CourseResult.NotCompleted ? null : (course.completionDate ?? today());

    this.save(
      this.api.updateCourse(course.id,{
        id: course.id,
        personnelId: course.personnelId,
        courseId: course.courseId,
        enrollmentDate: course.enrollmentDate,
        completionDate,
        result,
      }),
      () => this.loadCourses(),
    );
  }

  deactivate(): void {
    this.save(this.api.deactivate(this.personnelId), () => void this.router.navigate(['/personnel']));
  }

  private reloadUnits(search: string): void {
    this.unitRequest?.unsubscribe();
    this.unitSearch = search;
    this.unitPage = 0;
    this.unitTotalPages = 1;
    this.unitOptions.set([]);
    this.loadMoreUnits();
  }

  private save(request$: Observable<{ message?: string }>, onSuccess: () => void): void {
    if (this.saving()) {
      return;
    }

    this.saving.set(true);
    this.actionError.set(null);

    request$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: response => {
        this.showFlash(response.message ?? 'შენახულია');
        onSuccess();
      },
      error: err => this.actionError.set(apiErrorMessage(err)),
    });
  }

  private showFlash(message: string): void {
    this.flash.set(message);
    setTimeout(() => this.flash.set(null), 2500);
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}
