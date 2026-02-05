import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidenavService } from '../../../core/services/sidenav.service';

@Component({
  selector: 'app-angular-layout',
  templateUrl: './angular-layout.component.html',
  styleUrl: './angular-layout.component.scss'
})
export class AngularLayoutComponent implements OnInit, OnDestroy {
  sidenavOpen = false;
  private sub?: Subscription;

  constructor(private sidenav: SidenavService) {}

  ngOnInit() {
    this.sub = this.sidenav.open$.subscribe(open => (this.sidenavOpen = open));
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  closeSidenav() {
    this.sidenav.close();
  }
}
