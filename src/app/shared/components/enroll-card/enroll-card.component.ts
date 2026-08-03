import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CourseAccessService, Enrollment } from '../../../core/services/course-access.service';
import { CourseId } from '../../../core/course-catalog';

/**
 * Register / sign in / request access, for one course.
 * Shared so every course landing page behaves identically.
 */
@Component({
  selector: 'app-enroll-card',
  templateUrl: './enroll-card.component.html',
  styleUrl: './enroll-card.component.scss'
})
export class EnrollCardComponent implements OnInit {

  @Input({ required: true }) courseId!: CourseId;
  /** Where "continue the course" sends a user who already has access. */
  @Input() continueRoute: unknown[] = [];

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly access = inject(CourseAccessService);
  private readonly router = inject(Router);

  readonly enrollForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  mode: 'register' | 'login' = 'register';
  sent = false;
  busy = false;
  error = '';

  readonly appUser$ = this.authService.appUser$;

  /**
   * Built once in ngOnInit, not as a getter: the async pipe re-reads the
   * expression on every change detection pass, so a getter would hand it a new
   * Observable each time and the subscription would never settle.
   */
  enrollment$!: Observable<Enrollment | null>;

  ngOnInit() {
    this.enrollment$ = this.access.myEnrollment$(this.courseId);
  }

  hasAccess(user: { courses?: Record<string, boolean> } | null): boolean {
    return !!user?.courses?.[this.courseId];
  }

  isInvalid(control: 'firstName' | 'lastName' | 'email' | 'password'): boolean {
    const c = this.enrollForm.controls[control];
    return c.invalid && (c.dirty || c.touched);
  }

  isLoginInvalid(control: 'email' | 'password'): boolean {
    const c = this.loginForm.controls[control];
    return c.invalid && (c.dirty || c.touched);
  }

  setMode(mode: 'register' | 'login') {
    this.mode = mode;
    this.error = '';
  }

  async submitEnroll() {
    if (this.enrollForm.invalid) {
      this.enrollForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, password } = this.enrollForm.getRawValue();
    this.busy = true;
    this.error = '';

    try {
      if (!this.authService.currentUser) {
        await this.authService.register(firstName, lastName, email, password);
      }
      await this.access.requestEnrollment(this.courseId, firstName, lastName, email);
      this.sent = true;
    } catch (err: unknown) {
      this.error = this.errorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  async requestForCurrentUser() {
    const user = await firstValueFrom(this.appUser$);
    if (!user) {
      return;
    }
    this.busy = true;
    this.error = '';
    try {
      await this.access.requestEnrollment(this.courseId, user.firstName, user.lastName, user.email);
    } catch (err: unknown) {
      this.error = this.errorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  async submitLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    this.busy = true;
    this.error = '';

    try {
      await this.authService.login(email, password);
    } catch (err: unknown) {
      this.error = this.errorMessage(err);
    } finally {
      this.busy = false;
    }
  }

  async logout() {
    await this.authService.logout();
    this.sent = false;
    this.enrollForm.reset();
    this.loginForm.reset();
  }

  goContinue() {
    if (this.continueRoute.length) {
      this.router.navigate(this.continueRoute);
    }
  }

  private errorMessage(err: unknown): string {
    const code = (err as { code?: string })?.code ?? '';
    switch (code) {
      case 'auth/email-already-in-use':
        return 'ამ ელფოსტით ანგარიში უკვე არსებობს — გაიარე ავტორიზაცია.';
      case 'auth/weak-password':
        return 'პაროლი ძალიან სუსტია (მინიმუმ 6 სიმბოლო).';
      case 'auth/invalid-email':
        return 'ელფოსტა არასწორია.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'ელფოსტა ან პაროლი არასწორია.';
      case 'auth/too-many-requests':
        return 'ბევრი მცდელობა იყო. სცადე ცოტა ხანში.';
      case 'auth/network-request-failed':
        return 'ქსელთან კავშირი ვერ დამყარდა. სცადე ხელახლა.';
      case 'permission-denied':
        return 'ბაზამ წვდომა უარყო. შეამოწმე, Firestore-ის წესები გამოქვეყნებულია თუ არა (Rules → Publish).';
      default:
        return 'ოპერაცია ვერ შესრულდა. სცადე ხელახლა.';
    }
  }
}
