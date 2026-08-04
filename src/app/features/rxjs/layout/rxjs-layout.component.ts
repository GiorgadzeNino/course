import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SidenavService } from '../../../core/services/sidenav.service';
import { RXJS_LESSONS, RXJS_LEVEL_META, RXJS_LEVEL_ORDER, RxjsLesson, RxjsLevelKey, padLessonNum, rxjsLessonsByLevel } from '../rxjs-lessons';
import { LessonProgressService } from '../../../core/services/lesson-progress.service';
import { QuizProgressService, QuizResult } from '../../../core/services/quiz-progress.service';

/**
 * Recap quiz entries injected into the sidebar after the lecture(s) they
 * cover. Adding a new quiz = one more entry here.
 */
interface RecapEntry {
  /** Order — the sidebar shows the recap right after this lecture number. */
  afterNum: number;
  /** Sidebar label, e.g. "შეჯამება 1". */
  label: string;
  /** Route link for the quiz. */
  link: (string | number)[];
  /** URL prefix used by `activeRecap` detection. */
  urlKey: string;
  /** localStorage-backed quiz id used with {@link QuizProgressService}. */
  quizId: string;
}

const RECAPS: RecapEntry[] = [
  {
    afterNum: 2,
    label: 'შეჯამება 1',
    link: ['/courses', 'rxjs', 'quiz', '1-2'],
    urlKey: '/courses/rxjs/quiz/1-2',
    quizId: '1-2',
  },
];

/** Sidebar row — either a lecture or a recap. `@switch` in the template
 *  picks the right link/label based on `kind`. */
type SidebarRow =
  | { kind: 'lesson'; lesson: RxjsLesson }
  | { kind: 'recap'; recap: RecapEntry };

@Component({
  selector: 'app-rxjs-layout',
  templateUrl: './rxjs-layout.component.html',
  styleUrl: './rxjs-layout.component.scss'
})
export class RxjsLayoutComponent implements OnInit, OnDestroy {
  private readonly progress = inject(LessonProgressService);
  private readonly quizProgress = inject(QuizProgressService);

  sidenavOpen = false;
  activeNum: number | null = null;
  activeRecap: string | null = null;

  readonly levels = RXJS_LEVEL_ORDER.map(key => ({
    key,
    ...RXJS_LEVEL_META[key],
    lessons: rxjsLessonsByLevel(key),
    rows: this.buildRows(key),
  }));

  /** Interleave lessons in this level with recaps whose `afterNum` matches. */
  private buildRows(key: RxjsLevelKey): SidebarRow[] {
    const rows: SidebarRow[] = [];
    for (const lesson of rxjsLessonsByLevel(key)) {
      rows.push({ kind: 'lesson', lesson });
      for (const recap of RECAPS) {
        if (recap.afterNum === lesson.num) {
          rows.push({ kind: 'recap', recap });
        }
      }
    }
    return rows;
  }

  pad = padLessonNum;

  readonly totalLessons = RXJS_LESSONS.length;
  readonly completed$ = this.progress.completed$('rxjs');

  private sub?: Subscription;
  private routerSub?: Subscription;

  constructor(private sidenav: SidenavService, private router: Router) {}

  isDone(completed: number[] | null, num: number): boolean {
    return !!completed?.includes(num);
  }

  /** Latest saved result for the given recap, used to render ✓ + score. */
  recapResult$(recap: RecapEntry): Observable<QuizResult | null> {
    return this.quizProgress.result$('rxjs', recap.quizId);
  }

  progressPct(completed: number[] | null): number {
    return Math.round(((completed?.length ?? 0) / this.totalLessons) * 100);
  }

  ngOnInit() {
    this.sub = this.sidenav.open$.subscribe(open => (this.sidenavOpen = open));

    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateActiveFromUrl());

    this.updateActiveFromUrl();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.routerSub?.unsubscribe();
  }

  closeSidenav() {
    this.sidenav.close();
  }

  private updateActiveFromUrl() {
    const match = this.router.url.match(/\/courses\/rxjs\/lectures\/(\d+)/);
    this.activeNum = match ? Number(match[1]) : null;

    const recap = RECAPS.find(r => this.router.url.startsWith(r.urlKey));
    this.activeRecap = recap ? recap.urlKey : null;
  }
}
