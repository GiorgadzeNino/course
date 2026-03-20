import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-lecture-3',
  templateUrl: './lecture-3.component.html',
  styleUrl: './lecture-3.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Lecture3Component {
  directivesTab: 'old' | 'new' = 'old';

  constructor(private cdr: ChangeDetectorRef) {}

  setDirectivesTab(tab: 'old' | 'new') {
    this.directivesTab = tab;
    this.cdr.markForCheck();
  }

  // Code editor state for Structural Directives
  directiveCode = `@if (isLoggedIn) {
  <p>Welcome, User!</p>
}

<ul>
  @for (item of items; track item.id) {
    <li>{{ item.name }}</li>
  }
</ul>

@switch (role) {
  @case ('admin') {
    <p>Admin Panel</p>
  }
  @case ('user') {
    <p>User Dashboard</p>
  }
  @default {
    <p>Guest</p>
  }
}`;

  // Preview data for Structural Directives
  isLoggedIn = true;
  items = [
    { id: 1, name: 'Angular' },
    { id: 2, name: 'React' },
    { id: 3, name: 'Vue' }
  ];
  role: 'admin' | 'user' | 'guest' = 'admin';

  // Code editor state for Attribute Directives
  attributeDirectiveCode = `<div [ngClass]="{ active: isActive, disabled: isDisabled }">
  Button
</div>

<p [ngStyle]="{ color: textColor, fontSize: fontSize + 'px' }">
  Dynamic Styles
</p>`;

  // Preview data for Attribute Directives
  isActive = true;
  isDisabled = false;
  textColor = 'blue';
  fontSize = 16;

  // Code editor state for Custom Directive
  customDirectiveCode = `import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor(private el: ElementRef, @Inject(highlightColor) private highlightColor: string) {
    this.el.nativeElement.style.backgroundColor = highlightColor;
  }
}`;

  customDirectiveUsageCode = `  <p appHighlight [highlightColor]="highlightColor">
          Highlighted text with
  </p>`;

  // Preview data for Custom Directive
  highlightColor = '#cea135';

  // Pipe demo data
  userName = 'demetre';
  title = 'hello angular developers';
  today: Date = new Date(2026, 2, 20, 12, 0, 0); // 2026-03-20 (local time)
  price = 100;
  progress = 0.35;
  text = 'Angular Framework';

  users$: Observable<Array<{ name: string }>> = of([
    { name: 'Angular' },
    { name: 'React' },
    { name: 'Vue' }
  ]);

  showQuestions = false;
  showHomework = false;

  openQuestions() {
    this.showQuestions = true;
    this.cdr.markForCheck();
    setTimeout(() => {
      const element = document.getElementById('questions_3');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  openHomework() {
    this.showHomework = true;
    this.cdr.markForCheck();
    setTimeout(() => {
      const element = document.getElementById('homework_3');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}

