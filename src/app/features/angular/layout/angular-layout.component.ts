import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SidenavService } from '../../../core/services/sidenav.service';

@Component({
  selector: 'app-angular-layout',
  templateUrl: './angular-layout.component.html',
  styleUrl: './angular-layout.component.scss'
})
export class AngularLayoutComponent implements OnInit, OnDestroy {
  sidenavOpen = false;
  currentFragment: string | null = null;
  expandedModule: string | null = null;
  activeModule: string | null = null;
  private sub?: Subscription;
  private routerSub?: Subscription;
  private hashChangeHandler?: () => void;

  constructor(
    private sidenav: SidenavService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sub = this.sidenav.open$.subscribe(open => (this.sidenavOpen = open));
    
    // Listen to fragment changes from router events
    this.routerSub = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.updateActiveModuleFromUrl();

        // Get fragment from URL hash (works with hash-based routing)
        const urlTree = this.router.parseUrl(this.router.url);
        this.currentFragment = urlTree.fragment || null;
        
        // Also check hash in URL for hash-based routing
        if (!this.currentFragment && window.location.hash) {
          const hash = window.location.hash;
          // Extract fragment from hash like #/angular/1#overview
          const hashParts = hash.split('#');
          if (hashParts.length > 2) {
            this.currentFragment = hashParts[hashParts.length - 1];
          }
        }
      });

    // Initial values
    this.updateActiveModuleFromUrl();

    // Get initial fragment
    const urlTree = this.router.parseUrl(this.router.url);
    this.currentFragment = urlTree.fragment || null;
    
    // Also check hash in URL for hash-based routing
    if (!this.currentFragment && window.location.hash) {
      const hash = window.location.hash;
      const hashParts = hash.split('#');
      if (hashParts.length > 2) {
        this.currentFragment = hashParts[hashParts.length - 1];
      }
    }

    // Listen to hash changes (for scroll-based fragment updates)
    this.hashChangeHandler = () => {
      const hash = window.location.hash;
      const hashParts = hash.split('#');
      if (hashParts.length > 2) {
        this.currentFragment = hashParts[hashParts.length - 1];
      } else if (hashParts.length === 2 && hashParts[1]) {
        // Handle case where fragment is directly in hash
        this.currentFragment = hashParts[1];
      }
    };
    window.addEventListener('hashchange', this.hashChangeHandler);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.routerSub?.unsubscribe();
    if (this.hashChangeHandler) {
      window.removeEventListener('hashchange', this.hashChangeHandler);
    }
  }

  private updateActiveModuleFromUrl() {
    const match = this.router.url.match(/\/angular\/(\d+)/);
    this.activeModule = match?.[1] ?? null;

    // Auto-expand the active module in the accordion
    if (this.activeModule) {
      this.expandedModule = this.activeModule;
    }
  }

  toggleModule(module: string) {
    const isExpanding = this.expandedModule !== module;
    this.expandedModule = isExpanding ? module : null;

    if (isExpanding) {
      this.router.navigate(['/angular', module]);
    }
  }

  isModuleExpanded(module: string): boolean {
    return this.expandedModule === module;
  }

  closeSidenav() {
    this.sidenav.close();
  }

  navigateToQuestions(module: '1' | '2', event: MouseEvent) {
    event.preventDefault();

    const fragment = `questions_${module}`;
    const summaryId = `summary_${module}`;

    // Update URL fragment so the correct sidenav item is active
    this.router.navigate(['/angular', module], { fragment });

    // Scroll to the summary section (where the questions button is)
    setTimeout(() => {
      const element = document.getElementById(summaryId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);

    this.closeSidenav();
  }

  isFragmentActive(fragment: string): boolean {
    return this.currentFragment === fragment;
  }
}
