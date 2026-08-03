import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RXJS_LESSONS, RXJS_LEVEL_META, RxjsLesson } from '../../rxjs-lessons';
import { CourseAccessService, LessonContent } from '../../../../core/services/course-access.service';
import { LessonProgressService } from '../../../../core/services/lesson-progress.service';

@Component({
  selector: 'app-rxjs-lesson',
  templateUrl: './rxjs-lesson.component.html',
  styleUrl: './rxjs-lesson.component.scss'
})
export class RxjsLessonComponent implements OnInit, OnDestroy {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly access = inject(CourseAccessService);
  private readonly progress = inject(LessonProgressService);

  @ViewChild('body') bodyRef?: ElementRef<HTMLElement>;

  lesson?: RxjsLesson;
  levelLabel = '';
  locked = false;
  content: LessonContent | null = null;
  done = false;

  private sub?: Subscription;
  private progressSub?: Subscription;

  get totalLessons(): number {
    return RXJS_LESSONS.length;
  }

  get hasNext(): boolean {
    return !!this.lesson && this.lesson.num < this.totalLessons;
  }

  ngOnInit() {
    this.sub = this.route.paramMap.pipe(
      switchMap(params => {
        const num = Number(params.get('num'));
        this.lesson = RXJS_LESSONS.find(l => l.num === num);
        this.levelLabel = this.lesson ? RXJS_LEVEL_META[this.lesson.level].label : '';

        if (!this.lesson) {
          return of({ canRead: false, content: null as LessonContent | null });
        }

        return this.access.canRead$('rxjs', this.lesson.free).pipe(
          switchMap(canRead => canRead
            ? combineLatest([of(true), this.access.lessonContent$('rxjs', num)])
            : of([false, null] as [boolean, LessonContent | null])),
          switchMap(([canRead, content]) => of({ canRead: canRead as boolean, content }))
        );
      })
    ).subscribe({
      next: view => {
        this.locked = !view.canRead;
        this.content = view.content;
        this.watchProgress();
      },
      // A rules rejection is the expected outcome for a paid lesson, not a bug.
      error: () => {
        this.locked = true;
        this.content = null;
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.progressSub?.unsubscribe();
  }

  toggleComplete() {
    if (this.lesson) {
      this.progress.toggle('rxjs', this.lesson.num);
    }
  }

  goNext() {
    if (this.lesson && this.hasNext) {
      this.router.navigate(['/courses', 'rxjs', 'lectures', this.lesson.num + 1]);
      window.scrollTo(0, 0);
    }
  }

  /**
   * The rendered Markdown is injected with [innerHTML], so its run buttons
   * cannot carry Angular bindings. One delegated listener on the container
   * handles every editor in the lesson.
   */
  onBodyClick(event: Event) {
    const target = event.target as HTMLElement;
    const button = target.closest('.code-run');
    if (!button) {
      return;
    }

    const editor = button.closest('.code-editor');
    const console = editor?.nextElementSibling;
    if (console?.classList.contains('code-console')) {
      console.classList.toggle('is-collapsed');
    }
  }

  private watchProgress() {
    this.progressSub?.unsubscribe();
    if (!this.lesson) {
      return;
    }
    this.progressSub = this.progress
      .isDone$('rxjs', this.lesson.num)
      .subscribe(done => (this.done = done));
  }
}
