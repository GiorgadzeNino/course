import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RxjsCourseComponent } from './page/rxjs-course/rxjs-course.component';
import { RxjsLayoutComponent } from './layout/rxjs-layout.component';
import { RxjsLessonComponent } from './page/lesson/rxjs-lesson.component';
import { RxjsAdminComponent } from './page/admin/rxjs-admin.component';

const routes: Routes = [
  {
    path: '',
    component: RxjsCourseComponent
  },
  {
    path: 'admin',
    component: RxjsAdminComponent
  },
  {
    path: 'lectures',
    component: RxjsLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '1',
        pathMatch: 'full'
      },
      {
        path: ':num',
        component: RxjsLessonComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RxjsRoutingModule { }
