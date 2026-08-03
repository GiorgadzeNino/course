export type RxjsLevelKey = 'b' | 'i' | 'a';

export interface RxjsLesson {
  id: number;
  level: RxjsLevelKey;
  num: number;
  title: string;
  minutes: number;
  free: boolean;
  topics: string[];
}

export interface RxjsLevelMeta {
  label: string;
  emoji: string;
  range: string;
  dot: string;
}

export const RXJS_LEVEL_META: Record<RxjsLevelKey, RxjsLevelMeta> = {
  b: { label: 'BEGINNER', emoji: '🟢', range: 'ლექცია 1–5', dot: 'var(--color-accent-2-300)' },
  i: { label: 'INTERMEDIATE', emoji: '🟡', range: 'ლექცია 6–11', dot: 'var(--color-accent-200)' },
  a: { label: 'ADVANCED', emoji: '🔴', range: 'ლექცია 12–20', dot: 'var(--color-neutral-300)' },
};

export const RXJS_LESSONS: RxjsLesson[] = [
  {
    id: 1, level: 'b', num: 1, title: 'შესავალი: რატომ რეაქტიული პროგრამირება', minutes: 12, free: true,
    topics: ['სინქრონული vs ასინქრონული', 'callbacks → Promises → Observables', 'Push vs Pull', 'ReactiveX ეკოსისტემა'],
  },
  {
    id: 2, level: 'b', num: 2, title: 'პირველი ნაბიჯები Observable-თან', minutes: 14, free: true,
    topics: ['Observable / Observer / Subscription', 'subscribe(), next, error, complete', 'of, from', 'unsubscribe'],
  },
  {
    id: 3, level: 'b', num: 3, title: 'Creation ოპერატორები', minutes: 13, free: true,
    topics: ['of, from, fromEvent', 'interval, timer, range', 'EMPTY, NEVER, throwError', 'DOM მოვლენები'],
  },
  {
    id: 4, level: 'b', num: 4, title: 'pipe() და პირველი ოპერატორები', minutes: 12, free: false,
    topics: ['pipeable operators', 'pipe()', 'map, filter, tap'],
  },
  {
    id: 5, level: 'b', num: 5, title: 'Filtering ოპერატორები', minutes: 14, free: false,
    topics: ['take, first, last, skip', 'takeWhile, takeUntil', 'distinctUntilChanged, debounceTime'],
  },
  {
    id: 6, level: 'i', num: 6, title: 'Transformation ოპერატორები ღრმად', minutes: 16, free: false,
    topics: ['map vs scan vs reduce', 'scan-ით state', 'pairwise, bufferCount'],
  },
  {
    id: 7, level: 'i', num: 7, title: 'Higher-order Observables და Flattening', minutes: 18, free: false,
    topics: ['Observable-ის Observable', 'mergeMap, switchMap', 'concatMap, exhaustMap', 'შედარებითი ცხრილი'],
  },
  {
    id: 8, level: 'i', num: 8, title: 'Combination ოპერატორები', minutes: 16, free: false,
    topics: ['merge, concat', 'combineLatest, zip', 'forkJoin, withLatestFrom'],
  },
  {
    id: 9, level: 'i', num: 9, title: 'Error Handling', minutes: 15, free: false,
    topics: ['error terminates stream', 'catchError, retry', 'finalize', 'backoff'],
  },
  {
    id: 10, level: 'i', num: 10, title: 'Subjects — შესავალი multicasting-ში', minutes: 15, free: false,
    topics: ['Subject = Observable + Observer', 'BehaviorSubject, ReplaySubject', 'event bus'],
  },
  {
    id: 11, level: 'i', num: 11, title: 'Subscription Management და Memory Leaks', minutes: 14, free: false,
    topics: ['unsubscribe vs takeUntil', 'Subscription.add', 'leak diagnostics'],
  },
  {
    id: 12, level: 'a', num: 12, title: 'Observable-ის internals', minutes: 18, free: false,
    topics: ['subscribe = გამოძახება', 'Producer/Consumer, teardown', 'sync vs async emission'],
  },
  {
    id: 13, level: 'a', num: 13, title: 'Cold vs Hot და Multicasting ღრმად', minutes: 18, free: false,
    topics: ['producer ownership', 'share, shareReplay, refCount', 'side-effect გამრავლება'],
  },
  {
    id: 14, level: 'a', num: 14, title: 'Custom ოპერატორების წერა', minutes: 16, free: false,
    topics: ['OperatorFunction', 'ოპერატორის აწყობა', 'filterNil, retryWithBackoff'],
  },
  {
    id: 15, level: 'a', num: 15, title: 'Schedulers', minutes: 16, free: false,
    topics: ['asyncScheduler, asapScheduler', 'queueScheduler, animationFrame', 'observeOn, subscribeOn'],
  },
  {
    id: 16, level: 'a', num: 16, title: 'Marble Testing', minutes: 17, free: false,
    topics: ['marble სინტაქსი', 'TestScheduler, hot, cold', 'expectObservable'],
  },
  {
    id: 17, level: 'a', num: 17, title: 'Advanced პატერნები', minutes: 19, free: false,
    topics: ['RxJS state store', 'caching, shareReplay', 'polling, WebSocket wrapper'],
  },
  {
    id: 18, level: 'a', num: 18, title: 'RxJS Angular-ში', minutes: 17, free: false,
    topics: ['HttpClient', 'async pipe, takeUntilDestroyed', 'Reactive Forms, Router'],
  },
  {
    id: 19, level: 'a', num: 19, title: 'დებაგინგი და Performance', minutes: 15, free: false,
    topics: ['tap debugging, DevTools', 'anti-patterns', 'subscription count'],
  },
  {
    id: 20, level: 'a', num: 20, title: 'ფინალური პროექტი', minutes: 22, free: false,
    topics: ['autocomplete + live dashboard', 'ყველა კონცეფცია', 'code review checklist'],
  },
];

export const RXJS_LEVEL_ORDER: RxjsLevelKey[] = ['b', 'i', 'a'];

export function rxjsLessonsByLevel(key: RxjsLevelKey): RxjsLesson[] {
  return RXJS_LESSONS.filter(l => l.level === key);
}

export function padLessonNum(n: number): string {
  return n < 10 ? '0' + n : '' + n;
}
