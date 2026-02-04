import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './page/courses/courses.component';
import { AngularCourseComponent } from './page/angular/angular-course.component';

@NgModule({
  declarations: [CoursesComponent, AngularCourseComponent],
  imports: [CommonModule, CoursesRoutingModule],
})
export class CoursesModule {}
