import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

export interface Homework {
  id: number;
  title: string;
  level: 'basic' | 'intermediate' | 'advanced';
  description: string;
  tasks: string[];
}

@Component({
  selector: 'app-homework-3',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Homework3Component {
  constructor(private cdr: ChangeDetectorRef) {}
  homeworks: Homework[] = [
    {
      id: 1,
      title: 'დავალება 1: LoginStatusComponent',
      level: 'basic',
      description: 'შექმენი ახალი Angular component სახელად LoginStatusComponent.',
      tasks: [
        'დაამატე boolean ცვლადი isLoggedIn',
        'HTML-ში გამოიყენე *ngIf, რომ თუ isLoggedIn === true → აჩვენოს ტექსტი "Welcome, User!", წინააღმდეგ შემთხვევაში არაფერი არ გამოჩნდეს',
        'შეცვალე isLoggedIn მნიშვნელობა და შენიშნე ცვლილებები ბრაუზერში'
      ]
    },
    {
      id: 2,
      title: 'დავალება 2: ItemListComponent',
      level: 'basic',
      description: 'შექმენი component სახელად ItemListComponent.',
      tasks: [
        'ცვლადი items: string[] = [\'Angular\', \'React\', \'Vue\']',
        'გამოიყენე *ngFor თითოეული ელემენტის ჩვენებისთვის <li> ტეგში',
        'დაამატე input კენტი სტილი, როცა ელემენტი გამონახულია (optional: დაამატე trackBy ფუნქცია)'
      ]
    },
    {
      id: 3,
      title: 'დავალება 3: StyledButtonComponent',
      level: 'basic',
      description: 'შექმენი component სახელად StyledButtonComponent.',
      tasks: [
        'ცვლადი: isActive: boolean = true; isDisabled: boolean = false;',
        'HTML-ში გამოიყენე [ngClass] და [ngStyle] სტილის მართვისთვის',
        '[ngClass] უნდა შეცვალოს button-ის კლასი (active, disabled) isActive და isDisabled მიხედვით',
        '[ngStyle] უნდა შეცვალოს ტექსტის ფერი (color) და ზომა (font-size) ცვლადების მიხედვით'
      ]
    },
    {
      id: 4,
      title: 'დავალება 4: DashboardComponent (კომბინირებული დირექტივები)',
      level: 'intermediate',
      description: 'შექმენი component სახელით DashboardComponent.',
      tasks: [
        'ცვლადი: isLoggedIn = true; role = \'admin\'; items = [{ id: 1, name: \'Angular\' }, { id: 2, name: \'React\' }, { id: 3, name: \'Vue\' }]',
        '*ngIf აჩვენოს მხოლოდ Logged-in მომხმარებლისთვის შეტყობინება "Welcome!"',
        '*ngFor აჩვენოს სიაში items',
        '*ngSwitch აჩვენოს "Admin Panel", "User Dashboard", "Guest" role-ის მიხედვით',
        '<li> ელემენტებს დაუმატე HighlightDirective, რომ გამოყოფილ ელემენტს ფონური ფერი ჰქონდეს'
      ]
    }
  ];

  getLevelClass(level: string): string {
    switch (level) {
      case 'basic':
        return 'level-basic';
      case 'intermediate':
        return 'level-intermediate';
      case 'advanced':
        return 'level-advanced';
      default:
        return '';
    }
  }

  getLevelLabel(level: string): string {
    switch (level) {
      case 'basic':
        return 'მარტივი დონე';
      case 'intermediate':
        return 'საშუალო დონე';
      case 'advanced':
        return 'რთული დონე';
      default:
        return level;
    }
  }
}

