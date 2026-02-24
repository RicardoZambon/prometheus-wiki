import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import EasyMDE from 'easymde';
import { WikiService } from '../services/wiki.service';
import { WikiPageTreeNode } from '../../../core/models/wiki.model';

@Component({
  selector: 'app-wiki-editor',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ isEditMode() ? 'Edit Wiki Page' : 'Create Wiki Page' }}
        </h1>
      </div>

      @if (errorMessage) {
        <div class="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
          <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage }}
        </div>
      }

      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        @if (!isEditMode()) {
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input type="text" [(ngModel)]="title" placeholder="Page title"
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parent Page (optional)</label>
            <select [(ngModel)]="parentId"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors">
              <option [ngValue]="null">None (top level)</option>
              @for (page of flatPages(); track page.id) {
                <option [ngValue]="page.id">{{ page.prefix }}{{ page.title }}</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Language</label>
            <select [(ngModel)]="baseLanguage"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors">
              <option value="en">English</option>
              <option value="pt">Portuguese</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        }

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
          <textarea #editorTextarea></textarea>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button (click)="cancel()"
                  class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            Cancel
          </button>
          <button (click)="save()" [disabled]="saving()"
                  class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
            @if (saving()) { <i class="fa-solid fa-spinner fa-spin"></i> }
            {{ isEditMode() ? 'Update Page' : 'Create Page' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class WikiEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editorTextarea') editorTextarea!: ElementRef;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private wikiService = inject(WikiService);
  private editor!: EasyMDE;

  title = '';
  parentId: number | null = null;
  baseLanguage = 'en';
  errorMessage = '';
  saving = signal(false);
  flatPages = signal<{ id: number; title: string; prefix: string }[]>([]);

  isEditMode = computed(() => !!this.route.snapshot.paramMap.get('id'));
  private pageId: number | null = null;

  ngOnInit(): void {
    this.pageId = Number(this.route.snapshot.paramMap.get('id')) || null;

    this.wikiService.getTree().subscribe({
      next: tree => {
        const flat: { id: number; title: string; prefix: string }[] = [];
        const flatten = (nodes: WikiPageTreeNode[], depth: number) => {
          for (const node of nodes) {
            flat.push({ id: node.id, title: node.title, prefix: '\u00A0\u00A0'.repeat(depth) });
            if (node.children) flatten(node.children, depth + 1);
          }
        };
        flatten(tree, 0);
        this.flatPages.set(flat);
      }
    });
  }

  ngAfterViewInit(): void {
    this.editor = new EasyMDE({
      element: this.editorTextarea.nativeElement,
      spellChecker: false,
      autosave: { enabled: false, uniqueId: 'wiki-editor' },
      minHeight: '300px',
      toolbar: [
        'bold', 'italic', 'heading', '|',
        'quote', 'unordered-list', 'ordered-list', '|',
        'link', 'image', 'table', '|',
        'preview', 'side-by-side', 'fullscreen', '|',
        'guide'
      ]
    });

    if (this.pageId) {
      this.wikiService.getPage(this.pageId).subscribe({
        next: page => {
          this.title = page.title;
          if (page.content) {
            this.editor.value(page.content);
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.toTextArea();
    }
  }

  save(): void {
    const content = this.editor.value();
    if (!content.trim()) {
      this.errorMessage = 'Content is required.';
      return;
    }

    this.saving.set(true);
    this.errorMessage = '';

    if (this.isEditMode() && this.pageId) {
      this.wikiService.updatePage(this.pageId, content).subscribe({
        next: () => {
          this.router.navigate(['/wiki', this.pageId]);
        },
        error: (err) => {
          this.saving.set(false);
          this.errorMessage = err.error?.message ?? 'Failed to update page.';
        }
      });
    } else {
      if (!this.title.trim()) {
        this.saving.set(false);
        this.errorMessage = 'Title is required.';
        return;
      }
      this.wikiService.createPage({
        title: this.title,
        content: content,
        parentId: this.parentId,
        baseLanguage: this.baseLanguage
      }).subscribe({
        next: (page) => {
          this.router.navigate(['/wiki', page.id]);
        },
        error: (err) => {
          this.saving.set(false);
          this.errorMessage = err.error?.message ?? 'Failed to create page.';
        }
      });
    }
  }

  cancel(): void {
    if (this.pageId) {
      this.router.navigate(['/wiki', this.pageId]);
    } else {
      this.router.navigate(['/wiki']);
    }
  }
}
