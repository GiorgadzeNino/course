import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CourseId } from '../course-catalog';

const STORAGE_PREFIX = 'course_quiz_v1';

export interface QuizResult {
  score: number;
  total: number;
  /** ISO timestamp of the completion. */
  at: string;
}

/**
 * Persists quiz results per course + quiz-id (e.g. `rxjs/1-2`) in
 * localStorage. Kept off Firestore for the same reason as
 * {@link LessonProgressService}: per-device convenience, not paywall input.
 */
@Injectable({ providedIn: 'root' })
export class QuizProgressService {

  private readonly subjects = new Map<string, BehaviorSubject<QuizResult | null>>();

  result$(courseId: CourseId, quizId: string): Observable<QuizResult | null> {
    return this.subject(courseId, quizId).asObservable();
  }

  result(courseId: CourseId, quizId: string): QuizResult | null {
    return this.subject(courseId, quizId).value;
  }

  /** Overwrite if the new score is better, or if there is no prior result. */
  save(courseId: CourseId, quizId: string, result: QuizResult): void {
    const prior = this.result(courseId, quizId);
    if (prior && prior.score >= result.score) return;
    this.subject(courseId, quizId).next(result);
    this.persist(courseId, quizId, result);
  }

  private subject(courseId: CourseId, quizId: string): BehaviorSubject<QuizResult | null> {
    const key = this.key(courseId, quizId);
    let subject = this.subjects.get(key);
    if (!subject) {
      subject = new BehaviorSubject<QuizResult | null>(this.read(courseId, quizId));
      this.subjects.set(key, subject);
    }
    return subject;
  }

  private key(courseId: CourseId, quizId: string): string {
    return `${STORAGE_PREFIX}_${courseId}_${quizId}`;
  }

  private read(courseId: CourseId, quizId: string): QuizResult | null {
    try {
      const raw = localStorage.getItem(this.key(courseId, quizId));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (typeof parsed?.score === 'number' && typeof parsed?.total === 'number') {
        return { score: parsed.score, total: parsed.total, at: String(parsed.at ?? '') };
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  private persist(courseId: CourseId, quizId: string, result: QuizResult): void {
    try {
      localStorage.setItem(this.key(courseId, quizId), JSON.stringify(result));
    } catch (e) { /* storage unavailable — best-effort */ }
  }
}
