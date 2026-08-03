import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CourseId } from '../course-catalog';

const STORAGE_PREFIX = 'course_progress_v1';

/**
 * Which lessons the reader has marked as done.
 *
 * Kept in localStorage rather than Firestore: progress is per-device
 * convenience, not something the paywall depends on, and writing it to
 * Firestore would mean a document write on every checkbox toggle.
 */
@Injectable({ providedIn: 'root' })
export class LessonProgressService {

  private readonly subjects = new Map<CourseId, BehaviorSubject<number[]>>();

  completed$(courseId: CourseId): Observable<number[]> {
    return this.subject(courseId).asObservable();
  }

  isDone$(courseId: CourseId, lessonNum: number): Observable<boolean> {
    return this.completed$(courseId).pipe(map(list => list.includes(lessonNum)));
  }

  completed(courseId: CourseId): number[] {
    return this.subject(courseId).value;
  }

  isDone(courseId: CourseId, lessonNum: number): boolean {
    return this.completed(courseId).includes(lessonNum);
  }

  toggle(courseId: CourseId, lessonNum: number): void {
    const current = this.completed(courseId);
    const next = current.includes(lessonNum)
      ? current.filter(n => n !== lessonNum)
      : [...current, lessonNum].sort((a, b) => a - b);

    this.subject(courseId).next(next);
    this.persist(courseId, next);
  }

  private subject(courseId: CourseId): BehaviorSubject<number[]> {
    let subject = this.subjects.get(courseId);
    if (!subject) {
      subject = new BehaviorSubject<number[]>(this.read(courseId));
      this.subjects.set(courseId, subject);
    }
    return subject;
  }

  private read(courseId: CourseId): number[] {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}_${courseId}`);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(n => typeof n === 'number') : [];
    } catch (e) {
      return [];
    }
  }

  private persist(courseId: CourseId, list: number[]): void {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}_${courseId}`, JSON.stringify(list));
    } catch (e) { /* storage unavailable — progress is best-effort */ }
  }
}
