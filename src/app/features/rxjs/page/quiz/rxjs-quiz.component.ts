import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { Location } from '@angular/common';
import { QuizProgressService } from '../../../../core/services/quiz-progress.service';

/**
 * Self-contained quiz for RxJS lectures 1 & 2.
 *
 * The design comes from an existing standalone HTML mockup — dark theme, cyan
 * accents, JetBrains Mono, an ambient marble-stream canvas. The palette is
 * deliberately different from the surrounding organic landing/lesson pages
 * (light cream `--color-bg`), so the component owns its own visual world
 * scoped with `:host` and does NOT slot into `RxjsLayoutComponent`.
 */
interface QuizQuestion {
  /** Prompt as HTML — supports <code> for inline snippets. */
  q: string;
  opts: string[];
  correct: number;
  /** Explanation shown after the user picks an answer. */
  ex: string;
}

type LectureKey = 'a' | 'b';

@Component({
  selector: 'app-rxjs-quiz',
  templateUrl: './rxjs-quiz.component.html',
  styleUrl: './rxjs-quiz.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RxjsQuizComponent implements AfterViewInit, OnDestroy {

  @ViewChild('rail', { static: true }) rail!: ElementRef<HTMLCanvasElement>;

  readonly questions: Record<LectureKey, QuizQuestion[]> = {
    a: [
      {
        q: 'რა არის Observable-ის ფუნდამენტური ბუნება Push/Pull პარადიგმაში?',
        opts: [
          'Pull სისტემა ერთი მნიშვნელობისთვის',
          'Push სისტემა ერთი მნიშვნელობისთვის',
          'Push სისტემა მრავალი მნიშვნელობისთვის',
          'Pull სისტემა მრავალი მნიშვნელობისთვის',
        ],
        correct: 2,
        ex: '<b>Observable = Push მრავალი მნიშვნელობისთვის.</b> Producer აწვდის (push) მნიშვნელობებს Consumer-ს, და ეს ხდება მრავალჯერ, დროში გაწელილად. Function = Pull/ერთი, Iterator = Pull/მრავალი, Promise = Push/ერთი.',
      },
      {
        q: 'რომელია <b>არა</b> Promise-ის შეზღუდვა, რომელსაც Observable აგვარებს?',
        opts: [
          'Promise მხოლოდ ერთ მნიშვნელობას აბრუნებს',
          'Promise ვერ გაუქმდება დაწყების შემდეგ',
          'Promise eager-ია — მაშინვე იწყება',
          'Promise ვერ ამუშავებს შეცდომებს',
        ],
        correct: 3,
        ex: 'Promise <b>ამუშავებს</b> შეცდომებს (<code>.catch</code>). დანარჩენი სამი კი მისი რეალური შეზღუდვაა: ერთი მნიშვნელობა, გაუუქმებადობა და eager შესრულება — სწორედ ამათ აგვარებს Observable.',
      },
      {
        q: 'რას დაბეჭდავს ეს კოდი: <code>console.log(1); setTimeout(()=>console.log(2)); console.log(3);</code>',
        opts: ['1, 2, 3', '1, 3, 2', '3, 2, 1', '2, 1, 3'],
        correct: 1,
        ex: '<code>setTimeout</code> ასინქრონულია — მისი callback მიდის Callback Queue-ში და სრულდება მხოლოდ მას შემდეგ, რაც Call Stack გათავისუფლდება. ამიტომ <b>1, 3, 2</b> — "2" ბოლოს.',
      },
      {
        q: 'Callback Hell-ის (Pyramid of Doom) მთავარი პრობლემა რაშია?',
        opts: [
          'კოდი ნელა სრულდება',
          'ჩალაგებული callbacks კითხვადს აზიანებს და error handling მეორდება',
          'callbacks-ს მეხსიერება ბევრი სჭირდება',
          'ბრაუზერი ვერ ამუშავებს callbacks-ს',
        ],
        correct: 1,
        ex: 'Callback Hell-ის ბირთვი <b>კითხვადობისა და კომპოზიციის</b> პრობლემაა: კოდი მარჯვნივ იზრდება, error handling ყოველ დონეზე ცალკე უნდა დაიწეროს, და ცვლილება რთულდება.',
      },
      {
        q: 'Pull პარადიგმაში ვინ არის აქტიური?',
        opts: [
          'Producer — აწვდის, როცა მოესურვება',
          'Consumer — წყვეტს, როდის მიიღოს მონაცემი',
          'ორივე ერთდროულად',
          'არც ერთი — სისტემა თავად წყვეტს',
        ],
        correct: 1,
        ex: 'Pull-ში <b>Consumer აქტიურია</b> — ის "იწევს" (pull) მნიშვნელობას როცა მზადაა (მაგ. <code>iterator.next()</code>). Producer პასიურია. Push-ში პირიქითაა — Producer აქტიური, Consumer პასიური.',
      },
      {
        q: 'რომელ შემთხვევაში <b>ჯობს</b> RxJS-ის ნაცვლად <code>async/await</code>?',
        opts: [
          'Autocomplete search უამრავი keystroke-ით',
          'Live dashboard WebSocket-ებით',
          'ერთი მარტივი fetch გვერდის load-ზე',
          'Drag-and-drop mouse-ის მოძრაობით',
        ],
        correct: 2,
        ex: 'RxJS ბრწყინავს <b>მოვლენების ნაკადებზე</b> და კომპლექსურ ასინქრონულ კომპოზიციაზე. ერთი მარტივი, ერთჯერადი fetch-ისთვის ის ზედმეტ სირთულეს ამატებს — <code>async/await</code> ჯობს.',
      },
    ],
    b: [
      {
        q: 'რას ნიშნავს, რომ Observable "lazy"-ა?',
        opts: [
          'ის ნელა მუშაობს',
          'ის არაფერს აკეთებს, სანამ არ გამოვიწერთ (subscribe)',
          'ის მხოლოდ ერთ მნიშვნელობას აბრუნებს',
          'ის ავტომატურად ჩერდება 30 წამში',
        ],
        correct: 1,
        ex: 'Observable არის მხოლოდ "რეცეპტი". სანამ <code>subscribe()</code>-ს არ დავიძახებთ, <b>არც ერთი მნიშვნელობა არ იქმნება</b>. ეს განასხვავებს მას eager Promise-ისგან, რომელიც შექმნისთანავე იწყებს მუშაობას.',
      },
      {
        q: 'Observer-ის სამი მეთოდიდან რომელი <b>წყვეტს</b> ნაკადს?',
        opts: [
          'მხოლოდ <code>complete</code>',
          'მხოლოდ <code>error</code>',
          '<code>error</code> და <code>complete</code>',
          '<code>next</code>, <code>error</code> და <code>complete</code>',
        ],
        correct: 2,
        ex: '<code>next</code> შეიძლება 0..∞ ჯერ გამოიძახოს. მაგრამ <code>error</code> ან <code>complete</code> ნაკადს <b>ხურავს</b> — ორივე ტერმინალურია. მათ შემდეგ მეტი მნიშვნელობა აღარ მოვა.',
      },
      {
        q: 'რას დაბეჭდავს: <code>of([1,2,3]).subscribe(v=>console.log(v))</code>?',
        opts: ['1, 2, 3', '[1, 2, 3]', '1', 'error'],
        correct: 1,
        ex: '<code>of</code> მთელ არგუმენტს <b>ერთ მნიშვნელობად</b> აღიქვამს — ამიტომ გამოსცემს მთელ მასივს <code>[1, 2, 3]</code>. მასივის "გასაშლელად" საჭიროა <code>from([1,2,3])</code>, რომელიც დაბეჭდავს 1, 2, 3-ს ცალ-ცალკე.',
      },
      {
        q: 'რამდენჯერ სრულდება <code>new Observable(sub=>{...})</code>-ის producer ფუნქცია, თუ ორმა subscriber-მა გამოიწერა?',
        opts: [
          'ერთხელ — გაზიარებულია ორივესთვის',
          'ორჯერ — თითო subscribe-ზე ცალკე',
          'არასდროს — ის lazy-ა',
          'დამოკიდებულია ოპერატორებზე',
        ],
        correct: 1,
        ex: 'Producer ფუნქცია სრულდება <b>ყოველ subscribe-ზე ცალკე</b>. ორი გამომწერი = ორი დამოუკიდებელი შესრულება. ეს არის <b>cold Observable</b>-ის ბუნება (ლექცია 13-ში ღრმად).',
      },
      {
        q: 'რას აკეთებს teardown ფუნქცია (producer-ის <code>return</code>)?',
        opts: [
          'ხელახლა უშვებს Observable-ს',
          'ასუფთავებს რესურსებს გაუქმებისას (მაგ. <code>clearInterval</code>)',
          'გარდაქმნის მნიშვნელობებს',
          'ამატებს error handling-ს',
        ],
        correct: 1,
        ex: 'Teardown ფუნქცია <b>ასუფთავებს რესურსებს</b> — ის ავტომატურად გამოიძახება <code>unsubscribe</code>-ზე ან <code>complete</code>/<code>error</code>-ზე. ტაიმერების, listener-ების, WebSocket-ების გასუფთავება აქ ხდება, რაც leak-ს გვაცილებს.',
      },
      {
        q: 'რომელი <b>არ არის</b> გზა, რომ Observable-ის ნაკადი დაიხუროს?',
        opts: [
          '<code>complete()</code> — წარმატებით დასრულდა',
          '<code>error(err)</code> — შეცდომით დასრულდა',
          '<code>unsubscribe()</code> — ხელით გავაუქმეთ',
          '<code>next(null)</code> — null-ის გამოშვება',
        ],
        correct: 3,
        ex: '<code>next(null)</code> უბრალოდ <b>null მნიშვნელობას გამოსცემს</b> — ნაკადი ღია რჩება. დახურვის სამი ნამდვილი გზაა: <code>complete</code>, <code>error</code> და <code>unsubscribe</code>. სამივე იწვევს teardown-ს.',
      },
    ],
  };

  readonly keys = ['A', 'B', 'C', 'D'];

  /** Answered state keyed by "a0", "a1", ..., "b5". */
  answered: Record<string, boolean> = {};
  /** Which option index the user picked, keyed by question id. */
  picked: Record<string, number> = {};
  /** Whether the pick was correct, keyed by question id. */
  correctness: Record<string, boolean> = {};

  answeredCount = 0;
  score = 0;
  finished = false;

  get total(): number {
    return this.questions.a.length + this.questions.b.length;
  }

  get progressPct(): number {
    return (this.answeredCount / this.total) * 100;
  }

  /** Marble grid for the result summary — filled after `finished`. */
  get scoreMarbles(): { id: string; hit: boolean }[] {
    const ids: string[] = [];
    this.questions.a.forEach((_, i) => ids.push('a' + i));
    this.questions.b.forEach((_, i) => ids.push('b' + i));
    return ids.map(id => ({ id, hit: !!this.correctness[id] }));
  }

  get verdict(): string {
    const pct = this.score / this.total;
    if (pct === 1) return 'უნაკლო ნაკადი! 🌊';
    if (pct >= 0.75) return 'ძლიერი შედეგი';
    if (pct >= 0.5) return 'კარგი დასაწყისი';
    return 'დაბრუნდი ლექციებზე';
  }

  get subverdict(): string {
    const pct = this.score / this.total;
    if (pct === 1) return 'ორივე ლექცია მყარად გაქვს გააზრებული. მზად ხარ ლექცია 3-ისთვის.';
    if (pct >= 0.75) return 'საფუძველი კარგად გიდევს. გადახედე ერთ-ორ ახსნას და გააგრძელე.';
    if (pct >= 0.5) return 'ბაზისი გაქვს, მაგრამ ღირს ლექცია 1–2-ის ხელახლა გადათვალიერება.';
    return 'მთავარი ცნებები — lazy, Push/Pull, teardown — კიდევ ერთხელ გავიმეოროთ.';
  }

  /** Identifier used in localStorage for the saved result. */
  private readonly quizId = '1-2';
  /** Previously saved best result, if any — shown as a chip in the hero. */
  readonly savedBest = inject(QuizProgressService).result('rxjs', this.quizId);

  private readonly quizProgress = inject(QuizProgressService);
  private readonly location = inject(Location);

  private rafId = 0;
  private marbles: { x: number; y: number; r: number; speed: number; c: string }[] = [];
  private w = 0;
  private h = 0;
  private reduceMotion = false;

  constructor(private readonly zone: NgZone) {}

  /** Sends the browser back to whatever page opened the quiz (usually a lecture). */
  goBack() {
    this.location.back();
  }

  ngAfterViewInit() {
    this.reduceMotion = matchMedia('(prefers-reduced-motion:reduce)').matches;
    this.resizeAndSeed();

    if (this.reduceMotion) {
      // Static frame — draw once, no rAF.
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
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeAndSeed();
  }

  pick(prefix: LectureKey, i: number, correct: number) {
    const id = prefix + i;
    if (this.answered[id]) return;

    this.answered[id] = true;
    this.picked[id] = i;
    this.correctness[id] = i === correct;
    this.answeredCount++;
    if (i === correct) this.score++;

    if (this.answeredCount === this.total) {
      this.finished = true;
      // Persist the score — QuizProgressService keeps the best of any prior
      // attempt on the same device.
      this.quizProgress.save('rxjs', this.quizId, {
        score: this.score,
        total: this.total,
        at: new Date().toISOString(),
      });
      // Wait for the result panel to render, then scroll.
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

  optionClass(prefix: LectureKey, qi: number, oi: number, correct: number): string {
    const id = prefix + qi;
    if (!this.answered[id]) return '';
    if (oi === correct) return 'correct';
    if (oi === this.picked[id]) return 'wrong';
    return 'dim';
  }

  optionMark(prefix: LectureKey, qi: number, oi: number, correct: number): string {
    const id = prefix + qi;
    if (!this.answered[id]) return '';
    if (oi === correct) return '✓';
    if (oi === this.picked[id]) return '✗';
    return '';
  }

  private resizeAndSeed() {
    const cv = this.rail?.nativeElement;
    if (!cv) return;
    this.w = cv.width = window.innerWidth;
    this.h = cv.height = window.innerHeight;

    // Reseed marbles for the new viewport.
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
