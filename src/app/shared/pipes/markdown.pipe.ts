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
  comment: '#c9c0ac',   /* readable, still clearly a comment */
  string: '#d4e4a3',    /* brighter greens/oranges over dark #2e2b25 */
  number: '#ffb583',
  keyword: '#ffb583',
  rx: '#c8dc94',
  punct: '#f2ece0',
  ident: '#ffffff',     /* identifiers = plain white */
};

/** Fences rendered as plain blocks rather than an editor. */
const PLAIN_LANGUAGES = new Set(['text', 'console', 'output', 'bash', 'sh']);

/** Fences we execute in-browser when the reader clicks Run. An empty language
 *  is treated as JS *only* when the content actually looks like code — see
 *  {@link looksLikeDiagram}. Lessons author diagrams and tables inside bare
 *  ``` fences too, and those must not offer a Run button. */
const RUNNABLE_LANGUAGES = new Set(['', 'js', 'javascript', 'ts', 'typescript']);

/**
 * Heuristic: does this fence body read as ASCII art / a marble diagram
 * rather than JavaScript? Any of the box-drawing or arrow characters we
 * use in lesson diagrams is enough to disqualify it.
 */
function looksLikeDiagram(code: string): boolean {
  return /[─│┌┐└┘├┤┬┴┼━┃┏┓┗┛▶◀►◄→←↑↓⇒⇐▷]/.test(code);
}


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
function renderEditor(code: string, filename: string, runnable: boolean): string {
  const lines = code.replace(/\n$/, '').split('\n');
  const numbered = lines
    .map((line, i) => `<div class="code-line"><span class="code-num">${i + 1}</span><span class="code-text">${highlightLine(line)}</span></div>`)
    .join('');

  // Angular's DomSanitizer strips `<button>` and `data-*` attributes from
  // `[innerHTML]` output. Use a `<span role="button">` (span is on the
  // allowlist) and stash the raw source in a hidden `<pre class="code-source">`
  // whose text content survives sanitisation. Inline styles on the run span
  // so it always looks like a pill even if the .code-run class rule doesn't
  // reach it.
  const runButtonStyle = [
    'display:inline-block',
    'margin-left:auto',
    'font-family:var(--font-mono)',
    'background:var(--color-accent,#c67139)',
    'color:#fff',
    'padding:6px 14px',
    'border-radius:999px',
    'font-size:12px',
    'cursor:pointer',
    'flex:none',
    'white-space:nowrap',
    'user-select:none',
  ].join(';');

  // `hidden` attribute + `.code-source` CSS rule — inline `display:none` is
  // dropped by DomSanitizer, so neither alone is enough.
  const hiddenSource = runnable
    ? `<pre class="code-source" hidden aria-hidden="true">${escapeHtml(code)}</pre>`
    : '';

  const editor = `<div class="code-editor">
  <div class="code-bar">
    <span class="code-dot red"></span><span class="code-dot amber"></span><span class="code-dot green"></span>
    <span class="code-file">${escapeHtml(filename)}</span>
    <span class="code-run" role="button" tabindex="0" style="${runButtonStyle}">▶ გაშვება</span>
  </div>
  <div class="code-lines">${numbered}</div>
  ${hiddenSource}
</div>`;

  // Runnable editors need a console to write into. If the author supplied one
  // via a following ```console block, use theirs; otherwise attach an empty
  // placeholder the click handler can populate.
  if (runnable) {
    return editor + `<div class="code-console is-collapsed" data-generated="true">
  <div class="console-label">CONSOLE</div>
</div>`;
  }
  return editor;
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

      // An empty-language fence that carries diagram characters is a marble
      // chart or ASCII table — never runnable, never even styled as an editor.
      // Everything else falls through the normal rules.
      const isDiagram = !language && looksLikeDiagram(text);
      const runnable = !isDiagram && RUNNABLE_LANGUAGES.has(language);

      if (isDiagram || (!runnable && (PLAIN_LANGUAGES.has(language) || !filename))) {
        return `<pre class="code-plain"><code>${escapeHtml(text)}</code></pre>`;
      }

      return renderEditor(text, filename || `example.${language || 'js'}`, runnable);
    };

    return marked.parse(value, { async: false, gfm: true, breaks: false, renderer }) as string;
  }
}
