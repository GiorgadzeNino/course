import { Component, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { CourseAccessService, Enrollment, EnrollmentStatus } from '../../core/services/course-access.service';
import { COURSE_CATALOG, courseTitle } from '../../core/course-catalog';

type CourseFilter = 'all' | string;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  private readonly auth = inject(AuthService);
  private readonly access = inject(CourseAccessService);

  readonly courses = COURSE_CATALOG;
  readonly courseTitle = courseTitle;

  readonly isAdmin$: Observable<boolean> = this.auth.isAdmin$;
  readonly uid$: Observable<string | null> = this.auth.user$.pipe(map(u => u?.uid ?? null));

  private readonly filter$ = new BehaviorSubject<CourseFilter>('all');
  readonly activeFilter$ = this.filter$.asObservable();

  readonly enrollments$: Observable<Enrollment[]> = combineLatest([
    this.access.allEnrollments$,
    this.filter$,
  ]).pipe(
    map(([rows, filter]) => filter === 'all' ? rows : rows.filter(r => r.courseId === filter))
  );

  /** Pending count per course, for the filter chips. */
  readonly pendingCounts$: Observable<Record<string, number>> = this.access.allEnrollments$.pipe(
    map(rows => rows.reduce((acc, row) => {
      if (row.status === 'pending') {
        acc[row.courseId] = (acc[row.courseId] ?? 0) + 1;
        acc['all'] = (acc['all'] ?? 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>))
  );

  busyId: string | null = null;
  error = '';

  setFilter(filter: CourseFilter) {
    this.filter$.next(filter);
  }

  approve(enrollment: Enrollment) {
    return this.update(enrollment, 'approved');
  }

  reject(enrollment: Enrollment) {
    return this.update(enrollment, 'rejected');
  }

  private async update(enrollment: Enrollment, status: EnrollmentStatus) {
    this.busyId = enrollment.id ?? enrollment.uid;
    this.error = '';
    try {
      await this.access.setEnrollmentStatus(enrollment, status);
    } catch (e) {
      this.error = 'ოპერაცია ვერ შესრულდა — შეამოწმე, ადმინის უფლებები გაქვს თუ არა.';
    } finally {
      this.busyId = null;
    }
  }
}
