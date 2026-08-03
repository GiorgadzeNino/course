import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RxjsCourseComponent } from './page/rxjs-course/rxjs-course.component';
import { RxjsLayoutComponent } from './layout/rxjs-layout.component';
import { RxjsLessonComponent } from './page/lesson/rxjs-lesson.component';
import { RxjsLessonsIndexComponent } from './page/lessons-index/rxjs-lessons-index.component';

const routes: Routes = [
  {
    path: '',
    component: RxjsCourseComponent
  },
  {
    // Full-width catalogue of every lesson — deliberately outside the reader
    // layout, which is narrower and carries the sidebar.
    path: 'lectures',
    pathMatch: 'full',
    component: RxjsLessonsIndexComponent
  },
  {
    path: 'lectures',
    component: RxjsLayoutComponent,
    children: [
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
