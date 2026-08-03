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
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { RXJS_LESSONS } from './rxjs-lessons';

export type EnrollmentStatus = 'pending' | 'approved' | 'rejected';

export interface Enrollment {
  id?: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  status: EnrollmentStatus;
  requestedAt: unknown;
}

export interface LessonContent {
  num: number;
  intro: string[];
  code?: string;
  codeFile?: string;
  marble?: string;
}

/**
 * Access to the paid lessons.
 *
 * The flag here only decides what the UI shows. The actual protection is in
 * Firestore Security Rules: `lessonContent/{num}` is readable only when the
 * lesson is free or the caller's user document has `hasFullAccess == true`.
 * Never inline paid lesson text into the bundle.
 */
@Injectable({ providedIn: 'root' })
export class RxjsAccessService {

  private readonly firestore = inject(Firestore);
  private readonly auth = inject(AuthService);

  readonly hasFullAccess$: Observable<boolean> = this.auth.appUser$.pipe(
    map(user => !!user?.hasFullAccess)
  );

  /** Whether the UI should render the lesson body or the locked screen. */
  canRead$(lessonNum: number): Observable<boolean> {
    const lesson = RXJS_LESSONS.find(l => l.num === lessonNum);
    if (!lesson) {
      return of(false);
    }
    return lesson.free ? of(true) : this.hasFullAccess$;
  }

  /** Lesson body. Rules reject the read when the caller has no access. */
  lessonContent$(lessonNum: number): Observable<LessonContent | null> {
    return docData(doc(this.firestore, 'lessonContent', String(lessonNum))).pipe(
      map(content => (content as LessonContent) ?? null)
    );
  }

  /** The current user's own enrollment request, if any. */
  readonly myEnrollment$: Observable<Enrollment | null> = this.auth.user$.pipe(
    switchMap(user => user
      ? docData(doc(this.firestore, 'enrollments', user.uid), { idField: 'id' })
      : of(undefined)),
    map(enrollment => (enrollment as Enrollment) ?? null)
  );

  /**
   * Records a request for full access, keyed by uid so a user cannot spam rows.
   * Approval is manual — see `approveEnrollment`.
   */
  async requestEnrollment(firstName: string, lastName: string, email: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('not-signed-in');
    }
    await setDoc(doc(this.firestore, 'enrollments', user.uid), {
      uid: user.uid,
      firstName,
      lastName,
      email,
      status: 'pending' as EnrollmentStatus,
      requestedAt: serverTimestamp(),
    });
  }

  // ---------- admin ----------

  readonly pendingEnrollments$: Observable<Enrollment[]> = collectionData(
    query(collection(this.firestore, 'enrollments'), orderBy('requestedAt', 'desc')),
    { idField: 'id' }
  ) as Observable<Enrollment[]>;

  /** Grants access. Only admins pass the Security Rules check. */
  async approveEnrollment(enrollment: Enrollment): Promise<void> {
    await updateDoc(doc(this.firestore, 'users', enrollment.uid), { hasFullAccess: true });
    await updateDoc(doc(this.firestore, 'enrollments', enrollment.uid), { status: 'approved' });
  }

  async rejectEnrollment(enrollment: Enrollment): Promise<void> {
    await updateDoc(doc(this.firestore, 'users', enrollment.uid), { hasFullAccess: false });
    await updateDoc(doc(this.firestore, 'enrollments', enrollment.uid), { status: 'rejected' });
  }

  /** Combined view for the lesson page: access + content in one stream. */
  lessonView$(lessonNum: number) {
    return combineLatest([this.canRead$(lessonNum), this.auth.user$]).pipe(
      switchMap(([canRead]) => canRead
        ? this.lessonContent$(lessonNum).pipe(map(content => ({ canRead: true, content })))
        : of({ canRead: false, content: null as LessonContent | null }))
    );
  }
}
