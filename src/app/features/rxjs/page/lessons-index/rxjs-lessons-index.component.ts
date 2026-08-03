import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { CourseAccessService } from '../../../../core/services/course-access.service';
import {
  RXJS_LESSONS,
  RXJS_LEVEL_META,
  RXJS_LEVEL_ORDER,
  RxjsLesson,
  RxjsLevelKey,
} from '../../rxjs-lessons';

type LevelFilter = 'all' | RxjsLevelKey;

interface LessonCard {
  lesson: RxjsLesson;
  levelLabel: string;
  levelTagClass: string;
  themeClass: string;
  codeTag: string;
  blurb: string;
  locked: boolean;
}

/** Short code-flavoured label for a lesson thumbnail, cycled by level. */
const CODE_TAGS: Record<RxjsLevelKey, string[]> = {
  b: ['of()', 'from()', 'subscribe()', 'pipe()', 'filter()'],
  i: ['scan()', 'switchMap()', 'combineLatest()', 'catchError()', 'Subject', 'takeUntil()'],
  a: ['Observable', 'shareReplay()', 'OperatorFunction', 'asyncScheduler', 'TestScheduler', 'store$', 'HttpClient', 'tap()', 'project$'],
};

@Component({
  selector: 'app-rxjs-lessons-index',
  templateUrl: './rxjs-lessons-index.component.html',
  styleUrl: './rxjs-lessons-index.component.scss'
})
export class RxjsLessonsIndexComponent implements OnInit, OnDestroy {

  private readonly access = inject(CourseAccessService);

  readonly totalLessons = RXJS_LESSONS.length;
  readonly levels = RXJS_LEVEL_ORDER;
  readonly levelMeta = RXJS_LEVEL_META;

  activeLevel: LevelFilter = 'all';
  query = '';
  hasAccess = false;

  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.access.hasAccess$('rxjs').subscribe(granted => (this.hasAccess = granted));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  setLevel(level: LevelFilter) {
    this.activeLevel = level;
  }

  onSearch(event: Event) {
    this.query = (event.target as HTMLInputElement).value;
  }

  get cards(): LessonCard[] {
    const q = this.query.trim().toLowerCase();

    return RXJS_LESSONS
      .filter(lesson => {
        const levelOk = this.activeLevel === 'all' || lesson.level === this.activeLevel;
        const queryOk = !q
          || lesson.title.toLowerCase().includes(q)
          || lesson.topics.some(t => t.toLowerCase().includes(q));
        return levelOk && queryOk;
      })
      .map(lesson => {
        const indexInLevel = RXJS_LESSONS
          .filter(l => l.level === lesson.level)
          .findIndex(l => l.id === lesson.id);

        return {
          lesson,
          levelLabel: RXJS_LEVEL_META[lesson.level].label,
          levelTagClass: this.levelTagClass(lesson.level),
          themeClass: `theme-${lesson.level}`,
          codeTag: CODE_TAGS[lesson.level][indexInLevel] ?? 'rxjs',
          blurb: lesson.topics.slice(0, 3).join(' · '),
          locked: !lesson.free && !this.hasAccess,
        };
      });
  }

  get resultLabel(): string {
    const shown = this.cards.length;
    if (this.activeLevel === 'all' && !this.query.trim()) {
      return `${this.totalLessons} ლექცია — თეორია, კოდი, marble დიაგრამები`;
    }
    return `ნაჩვენებია ${shown} / ${this.totalLessons} ლექცია`;
  }

  levelTagClass(level: RxjsLevelKey): string {
    return level === 'b' ? 'tag-accent-2' : level === 'i' ? 'tag-accent' : 'tag-neutral';
  }

  countFor(level: RxjsLevelKey): number {
    return RXJS_LESSONS.filter(l => l.level === level).length;
  }
}
