import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SidenavService } from '../../../core/services/sidenav.service';
import { RXJS_LESSONS, RXJS_LEVEL_META, RXJS_LEVEL_ORDER, padLessonNum, rxjsLessonsByLevel } from '../rxjs-lessons';
import { LessonProgressService } from '../../../core/services/lesson-progress.service';

@Component({
  selector: 'app-rxjs-layout',
  templateUrl: './rxjs-layout.component.html',
  styleUrl: './rxjs-layout.component.scss'
})
export class RxjsLayoutComponent implements OnInit, OnDestroy {
  private readonly progress = inject(LessonProgressService);

  sidenavOpen = false;
  activeNum: number | null = null;

  readonly levels = RXJS_LEVEL_ORDER.map(key => ({
    key,
    ...RXJS_LEVEL_META[key],
    lessons: rxjsLessonsByLevel(key),
  }));

  pad = padLessonNum;

  readonly totalLessons = RXJS_LESSONS.length;
  readonly completed$ = this.progress.completed$('rxjs');

  private sub?: Subscription;
  private routerSub?: Subscription;

  constructor(private sidenav: SidenavService, private router: Router) {}

  isDone(completed: number[] | null, num: number): boolean {
    return !!completed?.includes(num);
  }

  progressPct(completed: number[] | null): number {
    return Math.round(((completed?.length ?? 0) / this.totalLessons) * 100);
  }

  ngOnInit() {
    this.sub = this.sidenav.open$.subscribe(open => (this.sidenavOpen = open));

    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.updateActiveFromUrl());

    this.updateActiveFromUrl();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.routerSub?.unsubscribe();
  }

  closeSidenav() {
    this.sidenav.close();
  }

  private updateActiveFromUrl() {
    const match = this.router.url.match(/\/courses\/rxjs\/lectures\/(\d+)/);
    this.activeNum = match ? Number(match[1]) : null;
  }
}
