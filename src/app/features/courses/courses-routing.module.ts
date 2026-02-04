import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './page/courses/courses.component';
import { AngularCourseComponent } from './page/angular/angular-course.component';

const routes: Routes = [
  {
    path: '',
    component: CoursesComponent,
  },
  {
    path: 'angular',
    component: AngularCourseComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesRoutingModule {}
