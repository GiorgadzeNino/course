/** Courses that can be sold. The id is used as the Firestore key everywhere. */
export type CourseId = 'rxjs' | 'angular';

export interface CourseInfo {
  id: CourseId;
  title: string;
  /** Landing route for the course. */
  route: string[];
  price: string;
}

export const COURSE_CATALOG: CourseInfo[] = [
  { id: 'rxjs', title: 'RxJS (Advanced)', route: ['/courses', 'rxjs'], price: '29 ₾' },
  { id: 'angular', title: 'Angular — სრული კურსი', route: ['/courses', 'angular'], price: '29 ₾' },
];

export function courseTitle(id: string): string {
  return COURSE_CATALOG.find(c => c.id === id)?.title ?? id;
}
