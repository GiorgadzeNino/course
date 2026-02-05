import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularLayoutComponent } from './layout/angular-layout.component';
import { Lecture1Component } from './page/lecture-1/lecture-1.component';
import { Lecture3Component } from './page/lecture-3/lecture-3.component';
import { Lecture4Component } from './page/lecture-4/lecture-4.component';
import { Lecture5Component } from './page/lecture-5/lecture-5.component';
import { Lecture2Component } from './page/lecture-2/lecture-2.component';

const routes: Routes = [
  {
    path: '',
    component: AngularLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '1',
        pathMatch: 'full'
      },
      {
        path: '1',
        component: Lecture1Component
      },
      {
        path: '2',
        component: Lecture2Component
      },
      {
        path: '3',
        component: Lecture3Component
      },
      {
        path: '4',
        component: Lecture4Component
      },
      {
        path: '5',
        component: Lecture5Component
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AngularRoutingModule { }
