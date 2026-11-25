export interface PersonnelProfile {
  id: number;
  name: string;
  surname: string;
  email: string;
  personalNumber: string;
  dateOfBirth: string;
  rankId: number;
  rank: { id: number; name: string } | null;
  phoneNumber: string;
  enlistmentDate: string;
  isActive: boolean;
}

export interface PersonnelProfileResponse {
  success: boolean;
  personnel: PersonnelProfile;
}

export interface AssignmentUnit {
  id: number;
  name: string;
  description: string;
}

export interface AssignmentPosition {
  id: number;
  name: string;
}

export interface Assignment {
  id: number;
  personnelId: number;
  militaryUnitId: number;
  militaryUnit: AssignmentUnit | null;
  positionId: number;
  position: AssignmentPosition | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

export interface AssignmentsResponse {
  success: boolean;
  personnelAssaignments: Assignment[];
}

export interface AssignmentPayload {
  personnelId: number;
  militaryUnitId: number;
  positionId: number;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

export enum CourseResult {
  NotCompleted = 0,
  SuccessfullyCompleted = 1,
  Failed = 2,
}

export const COURSE_RESULTS: CourseResult[] = [
  CourseResult.NotCompleted,
  CourseResult.SuccessfullyCompleted,
  CourseResult.Failed,
];

export const COURSE_RESULT_LABELS: Record<CourseResult, string> = {
  [CourseResult.NotCompleted]: 'მიმდინარე',
  [CourseResult.SuccessfullyCompleted]: 'წარმატებით დასრულდა',
  [CourseResult.Failed]: 'ვერ ჩააბარა',
};

export interface PersonnelCourse {
  id: number;
  personnelId: number;
  courseId: number;
  course: { id: number; name: string; durationInWeeks: number } | null;
  enrollmentDate: string;
  completionDate: string | null;
  result: CourseResult | null;
}

export interface PersonnelCoursesResponse {
  success: boolean;
  personnelCourses: PersonnelCourse[];
}

export interface PersonnelCoursePayload {
  personnelId: number;
  courseId: number;
  enrollmentDate: string;
  completionDate: string | null;
  result: CourseResult;
}

export interface PersonnelCourseUpdate extends PersonnelCoursePayload {
  id: number;
}

export interface Option {
  id: number;
  name: string;
  description: string;
}

export interface UnitsPage {
  totalPages: number;
  militaryUnits: Option[];
}

export interface MessageResponse {
  success: boolean;
  message: string;
}
