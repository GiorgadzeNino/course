import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RxjsRoutingModule } from './rxjs-routing.module';
import { RxjsCourseComponent } from './page/rxjs-course/rxjs-course.component';
import { RxjsLayoutComponent } from './layout/rxjs-layout.component';
import { RxjsLessonComponent } from './page/lesson/rxjs-lesson.component';
import { RxjsAdminComponent } from './page/admin/rxjs-admin.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    RxjsCourseComponent,
    RxjsLayoutComponent,
    RxjsLessonComponent,
    RxjsAdminComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    RxjsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class RxjsModule { }
