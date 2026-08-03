import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RXJS_LESSONS, RXJS_LEVEL_META, RxjsLesson } from '../../rxjs-lessons';
import { CourseAccessService, LessonContent } from '../../../../core/services/course-access.service';

@Component({
  selector: 'app-rxjs-lesson',
  templateUrl: './rxjs-lesson.component.html',
  styleUrl: './rxjs-lesson.component.scss'
})
export class RxjsLessonComponent implements OnInit, OnDestroy {
  lesson?: RxjsLesson;
  levelLabel = '';
  locked = false;
  content: LessonContent | null = null;

  private sub?: Subscription;

  constructor(private route: ActivatedRoute, private access: CourseAccessService) {}

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
  }
}
