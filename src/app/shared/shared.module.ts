import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UiButtonComponent } from './components/ui-button/ui-button.component';
import { SiteHeaderComponent } from './components/site-header/site-header.component';
import { CodeEditorComponent } from './components/code-editor/code-editor.component';
import { EnrollCardComponent } from './components/enroll-card/enroll-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MarkdownPipe } from './pipes/markdown.pipe';



@NgModule({
  declarations: [
    UiButtonComponent,
    SiteHeaderComponent,
    EnrollCardComponent,
    MarkdownPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CodeEditorComponent
  ],
  exports: [
    UiButtonComponent,
    SiteHeaderComponent,
    CodeEditorComponent,
    EnrollCardComponent,
    MarkdownPipe
  ]
})
export class SharedModule { }
