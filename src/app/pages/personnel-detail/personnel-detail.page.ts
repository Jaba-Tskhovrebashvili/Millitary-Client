import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { AbstractControl, FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PersonnelDetailApi } from './personnel-detail.api';
import { COURSE_RESULTS, COURSE_RESULT_LABELS, CourseResult, Option, PersonnelCourse } from './personnel-detail.models';
import { PersonnelDetailService } from './personnel-detail.service';

@Component({
  selector: 'app-personnel-detail-page',
  imports: [RouterLink, DatePipe, ReactiveFormsModule],
  providers: [PersonnelDetailService, PersonnelDetailApi],
  templateUrl: './personnel-detail.page.html',
  styleUrl: './personnel-detail.page.scss',
})
export class PersonnelDetailPage implements OnInit {
  readonly id = input.required<string>();

  protected readonly page = inject(PersonnelDetailService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly results = COURSE_RESULTS;
  protected readonly resultLabels = COURSE_RESULT_LABELS;

  protected readonly showAssignmentForm = signal(false);
  protected readonly showCourseForm = signal(false);
  protected readonly confirmDeactivate = signal(false);

  protected readonly unitText = signal('');
  protected readonly unitListOpen = signal(false);
  protected readonly selectedUnit = signal<Option | null>(null);

  protected readonly currentAssignment = computed(
    () => this.page.assignments().find(assignment => assignment.isCurrent) ?? null,
  );

  protected readonly assignmentForm = this.fb.group({
    militaryUnitId: new FormControl<number | null>(null, Validators.required),
    positionId: new FormControl<number | null>(null, Validators.required),
    startDate: [today(), Validators.required],
  });

  protected readonly courseForm = this.fb.group({
    courseId: new FormControl<number | null>(null, Validators.required),
    enrollmentDate: [today(), Validators.required],
  });

  ngOnInit(): void {
    this.page.load(Number(this.id()));
  }

  protected showError(control: AbstractControl): boolean {
    return control.invalid && control.touched;
  }

  protected unitLabel(unit: Option): string {
    return unit.description || unit.name;
  }

  protected openAssignmentForm(): void {
    this.assignmentForm.reset({ militaryUnitId: null, positionId: null, startDate: today() });
    this.unitText.set('');
    this.selectedUnit.set(null);
    this.unitListOpen.set(false);
    this.page.prepareAssignmentForm();
    this.showAssignmentForm.set(true);
  }

  protected closeAssignmentForm(): void {
    this.showAssignmentForm.set(false);
    this.unitListOpen.set(false);
  }

  protected onUnitTyping(text: string): void {
    this.unitText.set(text);
    this.selectedUnit.set(null);
    this.assignmentForm.controls.militaryUnitId.setValue(null);
    this.unitListOpen.set(true);
    this.page.searchUnits(text);
  }

  protected openUnitList(): void {
    this.unitListOpen.set(true);
  }

  protected closeUnitList(): void {
    this.unitListOpen.set(false);
    this.assignmentForm.controls.militaryUnitId.markAsTouched();

    const unit = this.selectedUnit();
    if (unit) {
      this.unitText.set(this.unitLabel(unit));
    }
  }

  protected chooseUnit(unit: Option): void {
    this.selectedUnit.set(unit);
    this.unitText.set(this.unitLabel(unit));
    this.assignmentForm.controls.militaryUnitId.setValue(unit.id);
    this.assignmentForm.controls.militaryUnitId.markAsTouched();
    this.unitListOpen.set(false);
  }

  protected onUnitListScroll(event: Event): void {
    const list = event.target as HTMLElement;
    const reachedBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 30;
    if (reachedBottom) {
      this.page.loadMoreUnits();
    }
  }

  protected submitAssignment(): void {
    this.assignmentForm.markAllAsTouched();

    const { militaryUnitId, positionId, startDate } = this.assignmentForm.getRawValue();
    if (militaryUnitId === null || positionId === null || !startDate) {
      return;
    }

    this.page.addAssignment(
      { militaryUnitId, positionId, startDate, endDate: null, isCurrent: true },
      () => this.closeAssignmentForm(),
    );
  }

  protected openCourseForm(): void {
    this.courseForm.reset({ courseId: null, enrollmentDate: today() });
    this.page.prepareCourseForm();
    this.showCourseForm.set(true);
  }

  protected submitCourse(): void {
    this.courseForm.markAllAsTouched();

    const { courseId, enrollmentDate } = this.courseForm.getRawValue();
    if (courseId === null || !enrollmentDate) {
      return;
    }

    this.page.addCourse(
      { courseId, enrollmentDate, completionDate: null, result: CourseResult.NotCompleted },
      () => this.showCourseForm.set(false),
    );
  }

  protected changeResult(course: PersonnelCourse, value: string): void {
    const result = Number(value) as CourseResult;
    if (result !== (course.result ?? CourseResult.NotCompleted)) {
      this.page.setCourseResult(course, result);
    }
  }

  protected serviceYears(enlistmentDate: string): number {
    const milliseconds = Date.now() - new Date(enlistmentDate).getTime();
    return Math.max(0, Math.floor(milliseconds / (365.25 * 24 * 60 * 60 * 1000)));
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}
