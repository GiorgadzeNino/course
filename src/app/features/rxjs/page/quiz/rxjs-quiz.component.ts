import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QuizProgressService } from '../../../../core/services/quiz-progress.service';
import { QuizConfig, QuizQuestion, QuizSection, RXJS_QUIZZES } from './rxjs-quizzes';

/**
 * Data-driven quiz. Loads its whole config from {@link RXJS_QUIZZES} using
 * the `:id` route param. Adding a new quiz is one entry in that map + one
 * `RECAPS` row in the layout — no changes here needed.
 *
 * The component owns its own dark palette scoped with `:host` and lives
 * outside `RxjsLayoutComponent` so the sidebar's cream theme does not fight
 * its accents. A single `[data-variant]` swap flips cyan → indigo accents
 * per quiz.
 */
@Component({
  selector: 'app-rxjs-quiz',
  templateUrl: './rxjs-quiz.component.html',
  styleUrl: './rxjs-quiz.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RxjsQuizComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('rail', { static: true }) rail!: ElementRef<HTMLCanvasElement>;

  readonly keys = ['A', 'B', 'C', 'D'];

  /** Currently loaded quiz — set from the route param. */
  config!: QuizConfig;
  /** Flat list of every question, in section order — used by `total` and
   *  progress. Answered/picked keyed by `${section.prefix}${index}`. */
  private flatQuestions: { section: QuizSection; index: number; question: QuizQuestion }[] = [];

  /** Answered state keyed by "a0", "b1", ... */
  answered: Record<string, boolean> = {};
  picked: Record<string, number> = {};
  correctness: Record<string, boolean> = {};

  answeredCount = 0;
  score = 0;
  finished = false;

  /** Previously saved best result, if any — refreshed when the id changes. */
  savedBest: ReturnType<QuizProgressService['result']> = null;

  /** Bound to the host element so SCSS can key off the palette variant. */
  @HostBinding('attr.data-variant') hostVariant: 'cyan' | 'indigo' | 'green' = 'cyan';

  private readonly route = inject(ActivatedRoute);
  private readonly quizProgress = inject(QuizProgressService);
  private readonly location = inject(Location);
  private readonly cdr = inject(ChangeDetectorRef);

  private routeSub?: Subscription;
  private rafId = 0;
  private marbles: { x: number; y: number; r: number; speed: number; c: string }[] = [];
  private w = 0;
  private h = 0;
  private reduceMotion = false;

  constructor(private readonly zone: NgZone) {}

  get total(): number {
    return this.flatQuestions.length;
  }

  get progressPct(): number {
    return (this.answeredCount / this.total) * 100;
  }

  /** Marble grid for the result summary — filled after `finished`. */
  get scoreMarbles(): { id: string; hit: boolean }[] {
    return this.flatQuestions.map(({ section, index }) => {
      const id = section.prefix + index;
      return { id, hit: !!this.correctness[id] };
    });
  }

  get verdict(): string {
    const pct = this.score / this.total;
    const v = this.config.verdict;
    if (pct === 1) return v.perfect.title;
    if (pct >= 0.75) return v.strong.title;
    if (pct >= 0.5) return v.ok.title;
    return v.weak.title;
  }

  get subverdict(): string {
    const pct = this.score / this.total;
    const v = this.config.verdict;
    if (pct === 1) return v.perfect.sub;
    if (pct >= 0.75) return v.strong.sub;
    if (pct >= 0.5) return v.ok.sub;
    return v.weak.sub;
  }

  ngOnInit() {
    // Re-load whenever the id in the URL changes so navigation between quizzes
    // (say via sidebar) resets state without a fresh component instance.
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id') ?? '1-2';
      const cfg = RXJS_QUIZZES[id];
      if (!cfg) return;
      this.loadConfig(cfg);
    });
  }

  ngAfterViewInit() {
    this.reduceMotion = matchMedia('(prefers-reduced-motion:reduce)').matches;
    this.resizeAndSeed();

    if (this.reduceMotion) {
      this.drawFrame(false);
    } else {
      // rAF outside Angular so change detection does not fire 60×/sec.
      this.zone.runOutsideAngular(() => {
        const loop = () => {
          this.drawFrame(true);
          this.rafId = requestAnimationFrame(loop);
        };
        this.rafId = requestAnimationFrame(loop);
      });
    }
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.rafId);
    this.routeSub?.unsubscribe();
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeAndSeed();
  }

  /** Sends the browser back to the page that opened the quiz. */
  goBack() {
    this.location.back();
  }

  pick(section: QuizSection, i: number, correct: number) {
    const id = section.prefix + i;
    if (this.answered[id]) return;

    this.answered[id] = true;
    this.picked[id] = i;
    this.correctness[id] = i === correct;
    this.answeredCount++;
    if (i === correct) this.score++;

    if (this.answeredCount === this.total) {
      this.finished = true;
      this.quizProgress.save('rxjs', this.config.id, {
        score: this.score,
        total: this.total,
        at: new Date().toISOString(),
      });
      queueMicrotask(() => {
        document.getElementById('quiz-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  reset() {
    this.answered = {};
    this.picked = {};
    this.correctness = {};
    this.answeredCount = 0;
    this.score = 0;
    this.finished = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  optionClass(section: QuizSection, qi: number, oi: number, correct: number): string {
    const id = section.prefix + qi;
    if (!this.answered[id]) return '';
    if (oi === correct) return 'correct';
    if (oi === this.picked[id]) return 'wrong';
    return 'dim';
  }

  optionMark(section: QuizSection, qi: number, oi: number, correct: number): string {
    const id = section.prefix + qi;
    if (!this.answered[id]) return '';
    if (oi === correct) return '✓';
    if (oi === this.picked[id]) return '✗';
    return '';
  }

  isAnswered(section: QuizSection, qi: number): boolean {
    return !!this.answered[section.prefix + qi];
  }

  private loadConfig(cfg: QuizConfig) {
    this.config = cfg;
    this.hostVariant = cfg.variant;
    this.flatQuestions = cfg.sections.flatMap(section =>
      section.questions.map((question, index) => ({ section, index, question }))
    );
    this.answered = {};
    this.picked = {};
    this.correctness = {};
    this.answeredCount = 0;
    this.score = 0;
    this.finished = false;
    this.savedBest = this.quizProgress.result('rxjs', cfg.id);
    this.cdr.markForCheck();
  }

  private resizeAndSeed() {
    const cv = this.rail?.nativeElement;
    if (!cv) return;
    this.w = cv.width = window.innerWidth;
    this.h = cv.height = window.innerHeight;

    const palette = ['#38bdf8', '#818cf8', '#34d399'];
    const lanes = 5;
    this.marbles = [];
    for (let l = 0; l < lanes; l++) {
      const y = (this.h / (lanes + 1)) * (l + 1);
      const count = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        this.marbles.push({
          x: Math.random() * this.w,
          y,
          r: 5 + Math.random() * 5,
          speed: 0.25 + Math.random() * 0.5,
          c: palette[Math.floor(Math.random() * palette.length)],
        });
      }
    }
  }

  private drawFrame(animate: boolean) {
    const cv = this.rail?.nativeElement;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, this.w, this.h);
    const lanes = 5;
    ctx.strokeStyle = 'rgba(43,61,80,.25)';
    ctx.lineWidth = 1;
    for (let l = 0; l < lanes; l++) {
      const y = (this.h / (lanes + 1)) * (l + 1);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.w, y);
      ctx.stroke();
    }

    for (const m of this.marbles) {
      if (animate) {
        m.x += m.speed;
        if (m.x > this.w + 20) m.x = -20;
      }
      ctx.beginPath();
      ctx.fillStyle = m.c;
      ctx.globalAlpha = 0.55;
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
}
