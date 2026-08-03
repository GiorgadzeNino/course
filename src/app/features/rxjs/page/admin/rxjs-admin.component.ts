import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { Enrollment, RxjsAccessService } from '../../rxjs-access.service';

@Component({
  selector: 'app-rxjs-admin',
  templateUrl: './rxjs-admin.component.html',
  styleUrl: './rxjs-admin.component.scss'
})
export class RxjsAdminComponent {

  private readonly auth = inject(AuthService);
  private readonly access = inject(RxjsAccessService);

  readonly isAdmin$: Observable<boolean> = this.auth.isAdmin$;
  /** Shown when access is refused, so the admins/{uid} document can be checked. */
  readonly uid$: Observable<string | null> = this.auth.user$.pipe(map(u => u?.uid ?? null));
  readonly enrollments$: Observable<Enrollment[]> = this.access.pendingEnrollments$;

  busyUid: string | null = null;
  error = '';

  async approve(enrollment: Enrollment) {
    await this.run(enrollment, () => this.access.approveEnrollment(enrollment));
  }

  async reject(enrollment: Enrollment) {
    await this.run(enrollment, () => this.access.rejectEnrollment(enrollment));
  }

  private async run(enrollment: Enrollment, action: () => Promise<void>) {
    this.busyUid = enrollment.uid;
    this.error = '';
    try {
      await action();
    } catch (e) {
      this.error = 'ოპერაცია ვერ შესრულდა — შეამოწმე, ადმინის უფლებები გაქვს თუ არა.';
    } finally {
      this.busyUid = null;
    }
  }
}
