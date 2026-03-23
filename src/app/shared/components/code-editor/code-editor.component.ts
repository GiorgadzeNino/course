import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type CodeEditorViewMode = 'split' | 'editor' | 'preview';
type CodeEditorFile = {
  name: string;
  content: string;
};

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeEditorComponent {
  @Input() code: string = '';
  @Output() codeChange = new EventEmitter<string>();
  @Input() files: CodeEditorFile[] = [];
  @Output() filesChange = new EventEmitter<CodeEditorFile[]>();
  @Input() activeFileIndex: number = 0;
  @Output() activeFileIndexChange = new EventEmitter<number>();
  @Input() showControls: boolean = false;
  @Input() editorTitle: string = '📝 კოდი (HTML Template)';
  @Input() previewTitle: string = '🌐 ბრაუზერის ხედი (Preview)';
  @Input() viewMode: CodeEditorViewMode = 'split';
  @Input() editable: boolean = true;

  // Backward compatibility for existing call-sites
  @Input() showPreview: boolean = true;
  @Input() showEditor: boolean = true;

  constructor(private cdr: ChangeDetectorRef) {}

  onCodeChange(value: string) {
    if (this.hasFiles) {
      const nextFiles = this.files.map((file, index) =>
        index === this.normalizedActiveFileIndex ? { ...file, content: value } : file
      );
      this.files = nextFiles;
      this.filesChange.emit(nextFiles);
    } else {
      this.code = value;
    }
    this.codeChange.emit(value);
    this.cdr.markForCheck();
  }

  onSelectFile(index: number) {
    if (index === this.activeFileIndex) return;
    this.activeFileIndex = index;
    this.activeFileIndexChange.emit(index);
    this.cdr.markForCheck();
  }

  get showEditorPanel(): boolean {
    if (this.viewMode === 'editor') return true;
    if (this.viewMode === 'preview') return false;
    return this.showEditor;
  }

  get showPreviewPanel(): boolean {
    if (this.viewMode === 'preview') return true;
    if (this.viewMode === 'editor') return false;
    return this.showPreview;
  }

  get hasFiles(): boolean {
    return this.files.length > 0;
  }

  get normalizedActiveFileIndex(): number {
    if (!this.hasFiles) return 0;
    return Math.max(0, Math.min(this.activeFileIndex, this.files.length - 1));
  }

  get activeFileName(): string {
    if (!this.hasFiles) return this.editorTitle;
    return this.files[this.normalizedActiveFileIndex].name;
  }

  get editorValue(): string {
    if (!this.hasFiles) return this.code;
    return this.files[this.normalizedActiveFileIndex].content;
  }
}

