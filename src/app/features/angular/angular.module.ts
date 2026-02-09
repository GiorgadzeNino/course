import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AngularRoutingModule } from './angular-routing.module';
import { AngularLayoutComponent } from './layout/angular-layout.component';
import { Lecture1Component } from './page/lecture-1/lecture-1.component';
import { Lecture2Component } from './page/lecture-2/lecture-2.component';
import { Lecture3Component } from './page/lecture-3/lecture-3.component';
import { Lecture4Component } from './page/lecture-4/lecture-4.component';
import { Lecture5Component } from './page/lecture-5/lecture-5.component';
import { QuestionsComponent } from './page/lecture-1/questions/questions.component';
import { Questions2Component } from './page/lecture-2/questions/questions.component';
import { Questions3Component } from './page/lecture-3/questions/questions.component';
import { Homework3Component } from './page/lecture-3/homework/homework.component';
import { QuestionsService } from '../../core/services/questions.service';
import { SharedModule } from '../../shared/shared.module';
import { HighlightDirective } from './page/lecture-3/directives/highlight.directive';
import { DemoChildComponent } from './page/lecture-2/demo-child/demo-child.component';
import { DemoInputChildComponent } from './page/lecture-2/demo-input-child/demo-input-child.component';

@NgModule({
  declarations: [
    AngularLayoutComponent,
    Lecture1Component,
    Lecture2Component,
    Lecture3Component,
    Lecture4Component,
    Lecture5Component,
    QuestionsComponent,
    Questions2Component,
    Questions3Component,
    Homework3Component,
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularRoutingModule,
    FormsModule,
    SharedModule,
    HighlightDirective,
    DemoChildComponent,
    DemoInputChildComponent
  ],
  providers: [QuestionsService]
})
export class AngularModule { }
