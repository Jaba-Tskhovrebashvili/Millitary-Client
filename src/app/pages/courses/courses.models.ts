export interface Course {
  id: number;
  name: string;
  description: string;
  durationInWeeks: number;
  isActive: boolean;
}

export interface CoursesResponse {
  success: boolean;
  ranks?: Course[];
  courses?: Course[];
}
