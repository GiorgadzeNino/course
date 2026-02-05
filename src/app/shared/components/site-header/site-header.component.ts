import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SidenavService } from '../../../core/services/sidenav.service';

@Component({
  selector: 'app-site-header',
  template: `
    <header class="w-full bg-white/85 backdrop-blur fixed top-0 left-0 right-0 z-50 border-b border-gray-100 shadow-sm">
      <div class="max-w-6xl mx-auto px-4 py-3 h-14 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          @if (showAngularBurger$ | async) {
            <button
              type="button"
              class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md bg-secondary text-white"
              (click)="sidenav.toggle()"
              aria-label="Toggle Angular sidenav"
            >
              <span class="text-xl leading-none">☰</span>
            </button>
          }
          <a class="text-sm font-semibold tracking-widest" routerLink="/home">
            <span class="text-gray-800">TUTOR</span>
          </a>
        </div>

        <div class="flex items-center gap-2">
     <!--      <nav class="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a routerLink="/home" fragment="what-i-teach" class="hover:text-gray-900">What I Teach</a>
            <a routerLink="/courses" class="hover:text-gray-900">Courses</a>
            <a routerLink="/home" fragment="pricing" class="hover:text-gray-900">Pricing</a>
            <a routerLink="/home" fragment="contact" class="hover:text-gray-900">Contact</a>
          </nav>

           Right side actions (always visible)
          <a
            routerLink="/home"
            fragment="pricing"
            class="inline-flex items-center rounded-md border border-gray-200 bg-white/70 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white transition"
          >
           ფასები
          </a>
          <a
            routerLink="/home"
            fragment="contact"
            class="inline-flex items-center rounded-md bg-secondary px-3 py-2 text-sm font-medium text-white hover:bg-secondary/90 transition"
          >
კონტაქტი       
   </a> -->
        </div>
      </div>
    </header>
  `,
  styles: ``
})
export class SiteHeaderComponent {
  showAngularBurger$: Observable<boolean>;

  constructor(
    private router: Router,
    public sidenav: SidenavService,
  ) {
    this.showAngularBurger$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.router.url.startsWith('/angular')),
    );
  }
}
