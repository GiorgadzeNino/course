import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as rxjs from 'rxjs';
import * as rxjsOperators from 'rxjs/operators';
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
    const button = target.closest('.code-run') as HTMLElement | null;
    if (!button) {
      return;
    }

    const editor = button.closest('.code-editor') as HTMLElement | null;
    const consoleEl = editor?.nextElementSibling as HTMLElement | null;
    if (!editor || !consoleEl?.classList.contains('code-console')) {
      return;
    }

    // A hidden <pre class="code-source"> inside the editor carries the raw
    // snippet — DomSanitizer strips data-* attributes but preserves text
    // nodes. Its absence means this is an author-supplied console block, so
    // fall back to the original toggle behaviour.
    const sourceEl = editor.querySelector('.code-source') as HTMLElement | null;
    if (!sourceEl) {
      consoleEl.classList.toggle('is-collapsed');
      return;
    }

    // Reset the panel to just its label, then rebuild output as the code runs.
    consoleEl.innerHTML = '<div class="console-label">CONSOLE</div>';
    consoleEl.classList.remove('is-collapsed');
    this.executeSnippet(sourceEl.textContent ?? '', consoleEl);
  }

  private executeSnippet(source: string, output: HTMLElement) {
    let emitted = 0;
    const append = (kind: 'log' | 'error', args: unknown[]) => {
      const line = document.createElement('div');
      line.className = kind === 'error' ? 'console-line console-line-error' : 'console-line';
      line.textContent = args.map(a => this.formatValue(a)).join(' ');
      output.appendChild(line);
      emitted++;
    };

    // A sandboxed console keeps the page console clean and lets us render each
    // call as its own line without racing the real console.
    const sandboxConsole = {
      log: (...args: unknown[]) => append('log', args),
      info: (...args: unknown[]) => append('log', args),
      warn: (...args: unknown[]) => append('log', args),
      error: (...args: unknown[]) => append('error', args),
    };

    // Snippets are illustrative — they contain `import { of } from 'rxjs'`
    // which `new Function` can't parse (no module scope). Strip those lines
    // and inject the same names as parameters so the lesson code runs
    // untouched otherwise.
    const stripped = source.replace(/^\s*import\s+[^;]*;?\s*$/gm, '');
    const scope = { ...rxjs, ...rxjsOperators } as Record<string, unknown>;
    const names = Object.keys(scope);
    const values = names.map(n => scope[n]);

    try {
      // `new Function` isolates the snippet from module scope. It is still
      // same-origin JS — lesson bodies are admin-authored, which is the trust
      // boundary the markdown pipe already relies on.
      const fn = new Function('console', ...names, `"use strict";\n${stripped}`);
      fn(sandboxConsole, ...values);
    } catch (err) {
      append('error', [err instanceof Error ? `${err.name}: ${err.message}` : String(err)]);
      return;
    }

    // Snippet ran fine but produced no output — usually a template exercise
    // with a `// შენი კოდი აქ` placeholder. Tell the reader what happened
    // instead of leaving the panel empty.
    if (emitted === 0) {
      const hint = document.createElement('div');
      hint.className = 'console-line console-line-hint';
      hint.textContent = '(კოდი შესრულდა, გამოსავალი არ არის — არცერთი console.log არ გამოძახებულა)';
      output.appendChild(hint);
    }
  }

  private formatValue(value: unknown): string {
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
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
