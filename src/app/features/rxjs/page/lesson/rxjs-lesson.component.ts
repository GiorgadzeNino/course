import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RXJS_LESSONS, RXJS_LEVEL_META, RxjsLesson } from '../../rxjs-lessons';
import { LessonContent, RxjsAccessService } from '../../rxjs-access.service';

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

  constructor(private route: ActivatedRoute, private access: RxjsAccessService) {}

  ngOnInit() {
    this.sub = this.route.paramMap.pipe(
      switchMap(params => {
        const num = Number(params.get('num'));
        this.lesson = RXJS_LESSONS.find(l => l.num === num);
        this.levelLabel = this.lesson ? RXJS_LEVEL_META[this.lesson.level].label : '';
        return this.access.lessonView$(num);
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
