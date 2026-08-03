import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CourseId } from '../course-catalog';

export type EnrollmentStatus = 'pending' | 'approved' | 'rejected';

export interface Enrollment {
  id?: string;
  courseId: CourseId;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  status: EnrollmentStatus;
  requestedAt: unknown;
}

export interface LessonContent {
  num: number;
  free: boolean;
  /** Lesson body as Markdown. Uploaded by scripts/seed-lessons.mjs. */
  body: string;
  updatedAt?: string;
}

/** One row per course per user, so a user can buy each course separately. */
export function enrollmentId(courseId: CourseId, uid: string): string {
  return `${courseId}__${uid}`;
}

/**
 * Per-course access to paid lessons, shared by every course feature.
 *
 * The observables here only decide what the UI renders. The actual protection
 * lives in Firestore Security Rules: `courses/{courseId}/lessons/{num}` is
 * readable only when the lesson is free or the caller's user document has
 * `courses[courseId] == true`. Paid lesson text must never be inlined into a
 * component — it has to come from Firestore.
 */
@Injectable({ providedIn: 'root' })
export class CourseAccessService {

  private readonly firestore = inject(Firestore);
  private readonly auth = inject(AuthService);

  /** Whether the signed-in user has been granted this course. */
  hasAccess$(courseId: CourseId): Observable<boolean> {
    return this.auth.appUser$.pipe(
      map(user => !!user?.courses?.[courseId])
    );
  }

  /** Whether the UI should render the lesson body or the locked screen. */
  canRead$(courseId: CourseId, isFreeLesson: boolean): Observable<boolean> {
    return isFreeLesson ? of(true) : this.hasAccess$(courseId);
  }

  /** Lesson body. Rules reject the read when the caller has no access. */
  lessonContent$(courseId: CourseId, lessonNum: number): Observable<LessonContent | null> {
    const path = `courses/${courseId}/lessons/${lessonNum}`;
    return docData(doc(this.firestore, path)).pipe(
      map(content => (content as LessonContent) ?? null)
    );
  }

  /** The current user's request for one course, if any. */
  myEnrollment$(courseId: CourseId): Observable<Enrollment | null> {
    return this.auth.user$.pipe(
      switchMap(user => user
        ? docData(doc(this.firestore, 'enrollments', enrollmentId(courseId, user.uid)), { idField: 'id' })
        : of(undefined)),
      map(enrollment => (enrollment as Enrollment) ?? null)
    );
  }

  async requestEnrollment(courseId: CourseId, firstName: string, lastName: string, email: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('not-signed-in');
    }
    await setDoc(doc(this.firestore, 'enrollments', enrollmentId(courseId, user.uid)), {
      courseId,
      uid: user.uid,
      firstName,
      lastName,
      email,
      status: 'pending' as EnrollmentStatus,
      requestedAt: serverTimestamp(),
    });
  }

  // ---------- admin ----------

  /** Every request across every course. Only admins pass the rules check. */
  readonly allEnrollments$: Observable<Enrollment[]> = collectionData(
    query(collection(this.firestore, 'enrollments'), orderBy('requestedAt', 'desc')),
    { idField: 'id' }
  ) as Observable<Enrollment[]>;

  async setEnrollmentStatus(enrollment: Enrollment, status: EnrollmentStatus): Promise<void> {
    const granted = status === 'approved';
    await updateDoc(doc(this.firestore, 'users', enrollment.uid), {
      [`courses.${enrollment.courseId}`]: granted,
    });
    await updateDoc(
      doc(this.firestore, 'enrollments', enrollmentId(enrollment.courseId, enrollment.uid)),
      { status }
    );
  }
}
