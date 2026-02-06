import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UiButtonComponent } from './components/ui-button/ui-button.component';
import { SiteHeaderComponent } from './components/site-header/site-header.component';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';



@NgModule({
  declarations: [
    UiButtonComponent,
    SiteHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CodeEditorComponent
  ],
  exports: [
    UiButtonComponent,
    SiteHeaderComponent,
    CodeEditorComponent
  ]
})
export class SharedModule { }
