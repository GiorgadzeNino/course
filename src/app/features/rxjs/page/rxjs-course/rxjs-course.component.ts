import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  RXJS_LESSONS,
  RXJS_LEVEL_META,
  RXJS_LEVEL_ORDER,
  RxjsLesson,
  RxjsLevelKey,
  padLessonNum,
  rxjsLessonsByLevel,
} from '../../rxjs-lessons';

interface Marble {
  v: number;
  left: number;
  color: string;
}

interface Outcome {
  paths: string[];
  title: string;
  body: string;
}

interface OpDef {
  key: string;
  label: string;
}

const STORAGE_KEY = 'rxjs_course_v1';

@Component({
  selector: 'app-rxjs-course',
  templateUrl: './rxjs-course.component.html',
  styleUrls: ['./rxjs-course.component.scss']
})
export class RxjsCourseComponent implements OnInit {

  readonly totalLessons = RXJS_LESSONS.length;

  completed: number[] = [];
  openLevels: RxjsLevelKey[] = ['b'];
  op = 'map';

  readonly outcomes: Outcome[] = [
    { paths: ['M4 12h4l2-6 4 12 2-6h4'], title: 'Observable-ის ბირთვი', body: 'Observable, Observer, Subscription და მათი სასიცოცხლო ციკლი.' },
    { paths: ['M3 6h18', 'M3 12h12', 'M3 18h6'], title: 'Creation & Filtering', body: 'of, from, interval, take, debounceTime, distinctUntilChanged.' },
    { paths: ['M12 3v18', 'M5 8l7-5 7 5'], title: 'Transformation', body: 'map, scan, reduce და მდგომარეობის დაგროვება.' },
    { paths: ['M6 3v6a3 3 0 0 0 3 3h9', 'M15 9l3 3-3 3'], title: 'Flattening', body: 'switchMap, mergeMap, concatMap, exhaustMap — და როდის რომელი.' },
    { paths: ['M12 9v4', 'M12 17h.01', 'M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z'], title: 'Error Handling', body: 'catchError, retry, backoff და graceful degradation.' },
    { paths: ['M8 6h11', 'M8 12h11', 'M8 18h11', 'M3 6h.01M3 12h.01M3 18h.01'], title: 'Subjects & Multicasting', body: 'BehaviorSubject, ReplaySubject, share, shareReplay.' },
    { paths: ['M12 2v4', 'M12 18v4', 'M2 12h4', 'M18 12h4', 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'], title: 'Schedulers', body: 'asyncScheduler, animationFrame, observeOn — timing-ის კონტროლი.' },
    { paths: ['M9 11l3 3 8-8', 'M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9'], title: 'Testing & Custom ops', body: 'marble testing, TestScheduler და საკუთარი ოპერატორები.' },
  ];

  readonly opDefs: OpDef[] = [
    { key: 'map', label: 'map(x => x * 10)' },
    { key: 'filter', label: 'filter(x => x % 2 === 0)' },
    { key: 'take', label: 'take(3)' },
    { key: 'debounceTime', label: 'debounceTime(20)' },
  ];

  readonly faqs = [
    { q: 'მჭირდება Angular-ის ცოდნა?', a: 'არა. RxJS ცალკე ისწავლება; Angular მხოლოდ ერთ ლექციაშია (18), როგორც პრაქტიკული კონტექსტი.' },
    { q: 'ვიდეოებია კურსში?', a: 'არა — კურსი სრულად ტექსტურია: თეორია, კოდის მაგალითები, marble დიაგრამები და პრაქტიკული დავალებები გადაწყვეტებით.' },
    { q: 'რა წინაპირობებია?', a: 'საბაზისო JavaScript (ფუნქციები, მასივები, ობიექტები) და ES6+. ასინქრონულ JS-ს კურსშივე გავიმეორებთ. TypeScript სასურველია, მაგრამ არა სავალდებულო.' },
  ];

  readonly heroInput = [
    { v: '1', left: 12, color: 'var(--color-accent-400)', delay: '0s' },
    { v: '2', left: 40, color: 'var(--color-accent-2-400)', delay: '.4s' },
    { v: '3', left: 70, color: 'var(--color-neutral-500)', delay: '.8s' },
  ];

  readonly heroOutput = [
    { v: '10', left: 12, color: 'var(--color-accent-400)' },
    { v: '20', left: 40, color: 'var(--color-accent-2-400)' },
    { v: '30', left: 70, color: 'var(--color-neutral-500)' },
  ];

  readonly levels = RXJS_LEVEL_ORDER.map(key => ({
    key,
    ...RXJS_LEVEL_META[key],
    lessons: rxjsLessonsByLevel(key),
  }));

  readonly previewLessons = RXJS_LESSONS.filter(l => l.free);

  /** Static payment details shown on the enrol card — replace with the real ones. */
  readonly payment = {
    price: '29 ₾',
    bank: 'TBC Bank',
    iban: 'GE00TB0000000000000000',
    recipient: 'ტესტ ტესტ',
    purpose: 'RxJS კურსი + შენი ელფოსტა',
  };

  constructor(private router: Router) {}

  ngOnInit() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const state = JSON.parse(raw);
        this.completed = state.completed || [];
      }
    } catch (e) { /* storage unavailable — start fresh */ }
  }

  // ---------- navigation ----------
  openLesson(lesson: RxjsLesson) {
    this.router.navigate(['/courses', 'rxjs', 'lectures', lesson.num]);
  }

  openFirst() {
    this.router.navigate(['/courses', 'rxjs', 'lectures', 1]);
  }

  scrollSyllabus() {
    const el = document.getElementById('syllabus');
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 20, behavior: 'smooth' });
    }
  }

  // ---------- syllabus accordion ----------
  toggleLevel(key: RxjsLevelKey) {
    this.openLevels = this.openLevels.indexOf(key) >= 0
      ? this.openLevels.filter(k => k !== key)
      : [...this.openLevels, key];
  }

  isLevelOpen(key: RxjsLevelKey): boolean {
    return this.openLevels.indexOf(key) >= 0;
  }

  isDone(id: number): boolean {
    return this.completed.indexOf(id) >= 0;
  }

  pad = padLessonNum;

  levelLabel(key: RxjsLevelKey): string {
    return RXJS_LEVEL_META[key].label;
  }

  levelTagClass(key: RxjsLevelKey): string {
    return key === 'b' ? 'tag-accent-2' : key === 'i' ? 'tag-accent' : 'tag-neutral';
  }

  blurb(lesson: RxjsLesson): string {
    return lesson.topics.slice(0, 3).join(' · ');
  }

  // ---------- marble playground ----------
  private get inputMarbles(): Marble[] {
    const cols = [
      'var(--color-accent-400)', 'var(--color-accent-2-400)', 'var(--color-neutral-500)',
      'var(--color-accent-400)', 'var(--color-accent-2-400)', 'var(--color-neutral-500)',
    ];
    return [1, 2, 3, 4, 5, 6].map((v, i) => ({ v, left: 8 + i * 14, color: cols[i] }));
  }

  get input(): Marble[] {
    return this.inputMarbles;
  }

  get output(): Marble[] {
    const input = this.inputMarbles;
    switch (this.op) {
      case 'map':
        return input.map(m => ({ ...m, v: m.v * 10 }));
      case 'filter':
        return input.filter(m => m.v % 2 === 0);
      case 'take':
        return input.slice(0, 3);
      default:
        return [
          { v: 3, left: input[2].left, color: input[2].color },
          { v: 6, left: input[5].left, color: input[5].color },
        ];
    }
  }

  get opLabel(): string {
    const def = this.opDefs.find(o => o.key === this.op);
    return def ? def.label : '';
  }

  get opNote(): string {
    switch (this.op) {
      case 'map':
        return 'map — თითოეულ მნიშვნელობას გარდაქმნის: 1→10, 2→20, … ნაკადის ფორმა უცვლელია.';
      case 'filter':
        return 'filter — ტოვებს მხოლოდ პირობის დამაკმაყოფილებელს (ლუწებს); დანარჩენს „ყრის".';
      case 'take':
        return 'take(3) — იღებს პირველ სამ მნიშვნელობას და შემდეგ ასრულებს ნაკადს (complete).';
      default:
        return 'debounceTime — გასცემს მნიშვნელობას მხოლოდ მაშინ, თუ მას მოსდევს „წყნარი" პაუზა; სწრაფ ბუსტებს ფილტრავს.';
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
