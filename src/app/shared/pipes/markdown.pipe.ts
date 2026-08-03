import { Pipe, PipeTransform } from '@angular/core';
import { Renderer, marked } from 'marked';

/** Language keywords, highlighted like the source design's editor. */
const KEYWORDS = new Set([
  'import', 'from', 'export', 'default', 'const', 'let', 'var', 'return', 'new',
  'function', 'class', 'extends', 'async', 'await', 'if', 'else', 'for', 'switch',
  'case', 'void', 'type', 'interface', 'yield', 'try', 'catch',
]);

/** RxJS and Observable vocabulary, given its own colour. */
const RX_NAMES = new Set([
  'of', 'from', 'fromEvent', 'interval', 'timer', 'range', 'map', 'filter', 'tap',
  'take', 'first', 'last', 'skip', 'takeWhile', 'takeUntil', 'distinctUntilChanged',
  'debounceTime', 'throttleTime', 'scan', 'mergeMap', 'switchMap', 'concatMap',
  'exhaustMap', 'merge', 'concat', 'combineLatest', 'zip', 'forkJoin', 'startWith',
  'catchError', 'retry', 'finalize', 'Observable', 'Subject', 'BehaviorSubject',
  'ReplaySubject', 'pipe', 'subscribe', 'next', 'error', 'complete', 'unsubscribe',
  'shareReplay', 'share', 'pairwise',
]);

const COLORS = {
  comment: '#8a8172',
  string: '#b7c489',
  number: '#f0a76b',
  keyword: '#f0a76b',
  rx: '#a9c07f',
  punct: '#a79c8a',
  ident: '#e8dfce',
};

/** Fences rendered as plain blocks rather than an editor. */
const PLAIN_LANGUAGES = new Set(['text', 'console', 'output', 'bash', 'sh', '']);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Colours one line of source. Deliberately a small hand-rolled tokenizer rather
 * than a highlighting library: it matches the design's palette exactly and adds
 * nothing to the bundle.
 */
function highlightLine(line: string): string {
  if (/^\s*\/\//.test(line)) {
    return `<span style="color:${COLORS.comment}">${escapeHtml(line)}</span>`;
  }

  let rest = line;
  let out = '';

  while (rest.length) {
    let match: RegExpMatchArray | null;
    let color: string;

    if ((match = rest.match(/^\s+/))) {
      out += escapeHtml(match[0]);
      rest = rest.slice(match[0].length);
      continue;
    } else if ((match = rest.match(/^\/\/.*/))) {
      color = COLORS.comment;
    } else if ((match = rest.match(/^(['"`])(?:\\.|(?!\1).)*\1/))) {
      color = COLORS.string;
    } else if ((match = rest.match(/^\d[\d.]*/))) {
      color = COLORS.number;
    } else if ((match = rest.match(/^[A-Za-z_$][\w$]*/))) {
      const word = match[0];
      color = KEYWORDS.has(word) ? COLORS.keyword : RX_NAMES.has(word) ? COLORS.rx : COLORS.ident;
    } else {
      match = rest.match(/^[^\w\s]/);
      color = COLORS.punct;
    }

    const token = match![0];
    out += `<span style="color:${color}">${escapeHtml(token)}</span>`;
    rest = rest.slice(token.length);
  }

  return out;
}

/**
 * Renders a fenced code block as the design's editor: window chrome, filename,
 * a run button and a collapsed console panel.
 *
 * Fence syntax — the info string carries the filename, and an immediately
 * following ```console block becomes that editor's output:
 *
 *     ```ts search.ts
 *     const search$ = ...
 *     ```
 *     ```console
 *     ვეძებ: rxjs
 *     ```
 */
function renderEditor(code: string, filename: string): string {
  const lines = code.replace(/\n$/, '').split('\n');
  const numbered = lines
    .map((line, i) => `<div class="code-line"><span class="code-num">${i + 1}</span><span class="code-text">${highlightLine(line)}</span></div>`)
    .join('');

  return `<div class="code-editor">
  <div class="code-bar">
    <span class="code-dot red"></span><span class="code-dot amber"></span><span class="code-dot green"></span>
    <span class="code-file">${escapeHtml(filename)}</span>
    <button type="button" class="code-run">▶ გაშვება</button>
  </div>
  <div class="code-lines">${numbered}</div>
</div>`;
}

function renderConsole(output: string): string {
  const lines = output.replace(/\n$/, '').split('\n')
    .map(line => `<div class="console-line">${escapeHtml(line)}</div>`)
    .join('');

  // A class rather than the `hidden` attribute: the console is revealed by the
  // run button, and a class survives sanitisation predictably.
  return `<div class="code-console is-collapsed">
  <div class="console-label">CONSOLE</div>
  ${lines}
</div>`;
}

/**
 * Renders Markdown to HTML.
 *
 * The result is bound with [innerHTML], so Angular's DomSanitizer strips
 * scripts and event handlers. Lesson bodies are admin-authored, and the
 * sanitizer is the second line of defence — do not bypass it.
 */
@Pipe({ name: 'markdown' })
export class MarkdownPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const renderer = new Renderer();

    renderer.code = ({ text, lang }) => {
      const [language = '', filename = ''] = (lang ?? '').trim().split(/\s+/);

      if (language === 'console' || language === 'output') {
        return renderConsole(text);
      }

      if (PLAIN_LANGUAGES.has(language) || !filename) {
        return `<pre class="code-plain"><code>${escapeHtml(text)}</code></pre>`;
      }

      return renderEditor(text, filename);
    };

    return marked.parse(value, { async: false, gfm: true, breaks: false, renderer }) as string;
  }
}
