import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnChanges {
  @Input() highlightColor: string = 'yellow';

  constructor(private el: ElementRef) {
    this.applyHighlight();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['highlightColor']) {
      this.applyHighlight();
    }
  }

  private applyHighlight() {
    if (this.highlightColor) {
      this.el.nativeElement.style.backgroundColor = this.highlightColor;
    }
    this.el.nativeElement.style.padding = '0.5rem';
    this.el.nativeElement.style.borderRadius = '0.25rem';
  }
}

