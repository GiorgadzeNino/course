import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.scss'
})
export class CodeEditorComponent {
  @Input() code: string = '';
  @Input() showControls: boolean = false;
  @Input() editorTitle: string = '📝 კოდი (HTML Template)';
  @Input() previewTitle: string = '🌐 ბრაუზერის ხედი (Preview)';
  @Input() showPreview: boolean = true;
  @Input() showEditor: boolean = true;
}

