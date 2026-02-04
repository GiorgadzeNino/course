import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularRoutingModule } from './angular-routing.module';
import { AngularLayoutComponent } from './layout/angular-layout.component';
import { Lecture1Component } from './page/lecture-1/lecture-1.component';
import { Lecture2Component } from './page/lecture-2/lecture-2.component';
import { Lecture3Component } from './page/lecture-3/lecture-3.component';
import { Lecture4Component } from './page/lecture-4/lecture-4.component';
import { Lecture5Component } from './page/lecture-5/lecture-5.component';
import { QuestionsComponent } from './page/lecture-1/questions/questions.component';

@NgModule({
  declarations: [
    AngularLayoutComponent,
    Lecture1Component,
    Lecture2Component,
    Lecture3Component,
    Lecture4Component,
    Lecture5Component,
    QuestionsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularRoutingModule
  ]
})
export class AngularModule { }
