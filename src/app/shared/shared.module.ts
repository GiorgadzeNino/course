import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from './components/ui-button/ui-button.component';
import { SiteHeaderComponent } from './components/site-header/site-header.component';



@NgModule({
  declarations: [
    UiButtonComponent,
    SiteHeaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UiButtonComponent,
    SiteHeaderComponent
  ]
})
export class SharedModule { }
