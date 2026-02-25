import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

@Component({
  selector: 'app-rich-editor',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichEditorComponent),
      multi: true,
    },
  ],
  template: `
    <div class="rich-editor-wrapper border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden"
         [class.focused]="isFocused">
      <!-- Toolbar -->
      <div class="rich-editor-toolbar flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
        <!-- Text formatting -->
        <button type="button" (click)="toggleBold()" [class.active]="isActive('bold')"
                class="toolbar-btn" title="Bold">
          <i class="fa-solid fa-bold"></i>
        </button>
        <button type="button" (click)="toggleItalic()" [class.active]="isActive('italic')"
                class="toolbar-btn" title="Italic">
          <i class="fa-solid fa-italic"></i>
        </button>
        <button type="button" (click)="toggleUnderline()" [class.active]="isActive('underline')"
                class="toolbar-btn" title="Underline">
          <i class="fa-solid fa-underline"></i>
        </button>
        <button type="button" (click)="toggleStrike()" [class.active]="isActive('strike')"
                class="toolbar-btn" title="Strikethrough">
          <i class="fa-solid fa-strikethrough"></i>
        </button>

        <span class="toolbar-divider"></span>

        <!-- Headings -->
        <button type="button" (click)="toggleHeading(1)" [class.active]="isActive('heading', { level: 1 })"
                class="toolbar-btn text-xs font-bold" title="Heading 1">
          H1
        </button>
        <button type="button" (click)="toggleHeading(2)" [class.active]="isActive('heading', { level: 2 })"
                class="toolbar-btn text-xs font-bold" title="Heading 2">
          H2
        </button>
        <button type="button" (click)="toggleHeading(3)" [class.active]="isActive('heading', { level: 3 })"
                class="toolbar-btn text-xs font-bold" title="Heading 3">
          H3
        </button>

        <span class="toolbar-divider"></span>

        <!-- Lists -->
        <button type="button" (click)="toggleBulletList()" [class.active]="isActive('bulletList')"
                class="toolbar-btn" title="Bullet List">
          <i class="fa-solid fa-list-ul"></i>
        </button>
        <button type="button" (click)="toggleOrderedList()" [class.active]="isActive('orderedList')"
                class="toolbar-btn" title="Ordered List">
          <i class="fa-solid fa-list-ol"></i>
        </button>

        <span class="toolbar-divider"></span>

        <!-- Block elements -->
        <button type="button" (click)="toggleBlockquote()" [class.active]="isActive('blockquote')"
                class="toolbar-btn" title="Blockquote">
          <i class="fa-solid fa-quote-left"></i>
        </button>
        <button type="button" (click)="toggleCodeBlock()" [class.active]="isActive('codeBlock')"
                class="toolbar-btn" title="Code Block">
          <i class="fa-solid fa-code"></i>
        </button>
        <button type="button" (click)="insertHorizontalRule()"
                class="toolbar-btn" title="Horizontal Rule">
          <i class="fa-solid fa-minus"></i>
        </button>

        <span class="toolbar-divider"></span>

        <!-- Inserts -->
        <button type="button" (click)="insertLink()"
                class="toolbar-btn" [class.active]="isActive('link')" title="Link">
          <i class="fa-solid fa-link"></i>
        </button>
        <button type="button" (click)="insertImage()"
                class="toolbar-btn" title="Image">
          <i class="fa-solid fa-image"></i>
        </button>
        <button type="button" (click)="insertTable()"
                class="toolbar-btn" title="Table">
          <i class="fa-solid fa-table"></i>
        </button>

        <span class="toolbar-divider"></span>

        <!-- Undo/Redo -->
        <button type="button" (click)="undo()"
                class="toolbar-btn" title="Undo">
          <i class="fa-solid fa-rotate-left"></i>
        </button>
        <button type="button" (click)="redo()"
                class="toolbar-btn" title="Redo">
          <i class="fa-solid fa-rotate-right"></i>
        </button>
      </div>

      <!-- Editor content area -->
      <div #editorElement class="rich-editor-content prose dark:text-gray-300 max-w-none"
           [style.min-height]="minHeight"></div>
    </div>
  `,
  styles: [`
    .toolbar-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      color: #6b7280;
      cursor: pointer;
      border: none;
      background: none;
      transition: all 0.15s;
      font-size: 13px;
    }
    .toolbar-btn:hover {
      background-color: #e5e7eb;
      color: #374151;
    }
    :host-context(.dark) .toolbar-btn:hover {
      background-color: #374151;
      color: #d1d5db;
    }
    .toolbar-btn.active {
      background-color: #dbeafe;
      color: #2563eb;
    }
    :host-context(.dark) .toolbar-btn.active {
      background-color: #1e3a8a;
      color: #93c5fd;
    }
    .toolbar-divider {
      display: inline-block;
      width: 1px;
      height: 20px;
      background-color: #d1d5db;
      margin: 0 4px;
    }
    :host-context(.dark) .toolbar-divider {
      background-color: #4b5563;
    }
    .rich-editor-content {
      padding: 12px 16px;
      background-color: white;
      cursor: text;
    }
    :host-context(.dark) .rich-editor-content {
      background-color: #111827;
      color: #e5e7eb;
    }
    .rich-editor-wrapper.focused {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }
    :host-context(.dark) .rich-editor-wrapper.focused {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
    }
  `],
})
export class RichEditorComponent implements AfterViewInit, OnDestroy, OnChanges, ControlValueAccessor {
  @ViewChild('editorElement') editorElement!: ElementRef;

  @Input() placeholder = 'Start writing...';
  @Input() minHeight = '300px';
  @Input() content = '';

  @Output() contentChange = new EventEmitter<string>();

  editor: Editor | null = null;
  isFocused = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private skipNextUpdate = false;
  private pendingContent: string | null = null;

  ngAfterViewInit(): void {
    this.editor = new Editor({
      element: this.editorElement.nativeElement,
      extensions: [
        StarterKit.configure({
          codeBlock: {
            HTMLAttributes: { class: 'code-block' },
          },
        }),
        Markdown,
        Table.configure({ resizable: false }),
        TableRow,
        TableCell,
        TableHeader,
        Image.configure({ inline: false }),
        Placeholder.configure({ placeholder: this.placeholder }),
        Underline,
        Link.configure({ openOnClick: false }),
      ],
      content: this.content || this.pendingContent || '',
      contentType: (this.content || this.pendingContent) ? 'markdown' : undefined,
      onUpdate: ({ editor }) => {
        if (this.skipNextUpdate) {
          this.skipNextUpdate = false;
          return;
        }
        const markdown = editor.getMarkdown();
        this.contentChange.emit(markdown);
        this.onChange(markdown);
      },
      onFocus: () => { this.isFocused = true; },
      onBlur: () => {
        this.isFocused = false;
        this.onTouched();
      },
    });

    if (this.pendingContent) {
      this.pendingContent = null;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content'] && !changes['content'].firstChange) {
      const newContent = changes['content'].currentValue ?? '';
      if (this.editor) {
        this.skipNextUpdate = true;
        this.editor.commands.setContent(newContent, { contentType: 'markdown', emitUpdate: false });
      }
    }
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  // ControlValueAccessor
  writeValue(value: string): void {
    const content = value ?? '';
    if (this.editor) {
      this.skipNextUpdate = true;
      this.editor.commands.setContent(content, { contentType: 'markdown', emitUpdate: false });
    } else {
      this.pendingContent = content;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Toolbar actions
  isActive(name: string, attrs?: Record<string, unknown>): boolean {
    return this.editor?.isActive(name, attrs) ?? false;
  }

  toggleBold(): void {
    this.editor?.chain().focus().toggleBold().run();
  }

  toggleItalic(): void {
    this.editor?.chain().focus().toggleItalic().run();
  }

  toggleUnderline(): void {
    this.editor?.chain().focus().toggleUnderline().run();
  }

  toggleStrike(): void {
    this.editor?.chain().focus().toggleStrike().run();
  }

  toggleHeading(level: 1 | 2 | 3): void {
    this.editor?.chain().focus().toggleHeading({ level }).run();
  }

  toggleBulletList(): void {
    this.editor?.chain().focus().toggleBulletList().run();
  }

  toggleOrderedList(): void {
    this.editor?.chain().focus().toggleOrderedList().run();
  }

  toggleBlockquote(): void {
    this.editor?.chain().focus().toggleBlockquote().run();
  }

  toggleCodeBlock(): void {
    this.editor?.chain().focus().toggleCodeBlock().run();
  }

  insertHorizontalRule(): void {
    this.editor?.chain().focus().setHorizontalRule().run();
  }

  insertLink(): void {
    if (this.editor?.isActive('link')) {
      this.editor.chain().focus().unsetLink().run();
      return;
    }
    const url = prompt('Enter URL:');
    if (url) {
      this.editor?.chain().focus().setLink({ href: url }).run();
    }
  }

  insertImage(): void {
    const url = prompt('Enter image URL:');
    if (url) {
      this.editor?.chain().focus().setImage({ src: url }).run();
    }
  }

  insertTable(): void {
    this.editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  undo(): void {
    this.editor?.chain().focus().undo().run();
  }

  redo(): void {
    this.editor?.chain().focus().redo().run();
  }
}
