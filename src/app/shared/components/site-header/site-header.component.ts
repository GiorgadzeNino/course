import { Component } from '@angular/core';

@Component({
  selector: 'app-site-header',
  template: `
    <header class="w-full bg-white/80 backdrop-blur sticky top-0 z-50 border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a class="text-sm font-semibold tracking-widest" routerLink="/home">
          <span class="text-gray-800">TUTOR</span> <span class="italic text-gray-500">Nino</span>
        </a>
        <nav class="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a routerLink="/home" class="hover:text-gray-900">About</a>
          <a routerLink="/home" fragment="what-i-teach" class="hover:text-gray-900">What I Teach</a>
          <a routerLink="/home" fragment="pricing" class="hover:text-gray-900">Pricing</a>
          <a routerLink="/home" fragment="contact" class="hover:text-gray-900">Contact</a>
        </nav>
      </div>
    </header>
  `,
  styles: ``
})
export class SiteHeaderComponent {}
