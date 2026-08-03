import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SidenavService } from '../../../core/services/sidenav.service';
import { RXJS_LEVEL_META, RXJS_LEVEL_ORDER, padLessonNum, rxjsLessonsByLevel } from '../rxjs-lessons';

@Component({
  selector: 'app-rxjs-layout',
  templateUrl: './rxjs-layout.component.html',
  styleUrl: './rxjs-layout.component.scss'
})
export class RxjsLayoutComponent implements OnInit, OnDestroy {
  sidenavOpen = false;
  activeNum: number | null = null;

  readonly levels = RXJS_LEVEL_ORDER.map(key => ({
    key,
    ...RXJS_LEVEL_META[key],
    lessons: rxjsLessonsByLevel(key),
  }));

  pad = padLessonNum;

  private sub?: Subscription;
  private routerSub?: Subscription;

  constructor(private sidenav: SidenavService, private router: Router) {}

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
