import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';

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
    return marked.parse(value, { async: false, gfm: true, breaks: false }) as string;
  }
}
