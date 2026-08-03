import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './page/courses/courses.component';
import { AngularCourseComponent } from './page/angular/angular-course.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [CoursesComponent, AngularCourseComponent],
  imports: [CommonModule, CoursesRoutingModule, SharedModule],
})
export class CoursesModule {}
