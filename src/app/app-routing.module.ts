import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'angular',
    loadChildren: () =>
      import('./features/angular/angular.module').then(m => m.AngularModule),
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./features/courses/courses.module').then(
        m => m.CoursesModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    scrollOffset: [0, 56] // Offset for fixed header
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
