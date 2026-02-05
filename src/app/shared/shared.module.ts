import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiButtonComponent } from './components/ui-button/ui-button.component';
import { SiteHeaderComponent } from './components/site-header/site-header.component';



@NgModule({
  declarations: [
    UiButtonComponent,
    SiteHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    UiButtonComponent,
    SiteHeaderComponent
  ]
})
export class SharedModule { }
