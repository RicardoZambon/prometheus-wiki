import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TopicService } from '../services/topic.service';
import { Category, Tag } from '../../../core/models/topic.model';

@Component({
  selector: 'app-create-topic-modal',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="close.emit()">
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
           (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">New Topic</h2>
          <button (click)="close.emit()"
                  class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="p-6 space-y-4">
          @if (errorMessage) {
            <div class="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
              <i class="fa-solid fa-circle-exclamation"></i> {{ errorMessage }}
            </div>
          }

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input type="text" [(ngModel)]="title" placeholder="What's your question?"
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select [(ngModel)]="categoryId"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors">
              <option [ngValue]="null" disabled>Select a category</option>
              @for (cat of categories; track cat.id) {
                <option [ngValue]="cat.id">{{ cat.name }}</option>
              }
            </select>
          </div>

          @if (tags.length > 0) {
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
              <div class="flex flex-wrap gap-2">
                @for (tag of tags; track tag.id) {
                  <button type="button" (click)="toggleTag(tag.id)"
                          [class]="selectedTagIds.includes(tag.id)
                            ? 'px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 border border-primary-300 dark:border-primary-700 transition-colors'
                            : 'px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors'">
                    {{ tag.name }}
                  </button>
                }
              </div>
            </div>
          }

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content (Markdown supported)</label>
            <textarea [(ngModel)]="content" rows="8" placeholder="Describe your question in detail..."
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono text-sm transition-colors"></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <button (click)="close.emit()"
                  class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            Cancel
          </button>
          <button (click)="submit()" [disabled]="saving || !title.trim() || !content.trim() || !categoryId"
                  class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
            @if (saving) {
              <i class="fa-solid fa-spinner fa-spin"></i>
            }
            Create Topic
          </button>
        </div>
      </div>
    </div>
  `
})
export class CreateTopicModalComponent {
  @Input() categories: Category[] = [];
  @Input() tags: Tag[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  private topicService = inject(TopicService);
  private router = inject(Router);

  title = '';
  content = '';
  categoryId: number | null = null;
  selectedTagIds: number[] = [];
  saving = false;
  errorMessage = '';

  toggleTag(tagId: number): void {
    const index = this.selectedTagIds.indexOf(tagId);
    if (index === -1) {
      this.selectedTagIds.push(tagId);
    } else {
      this.selectedTagIds.splice(index, 1);
    }
  }

  submit(): void {
    if (!this.title.trim() || !this.content.trim() || !this.categoryId) return;

    this.saving = true;
    this.errorMessage = '';

    this.topicService.createTopic({
      title: this.title,
      content: this.content,
      categoryId: this.categoryId,
      tagIds: this.selectedTagIds
    }).subscribe({
      next: (topic) => {
        this.router.navigate(['/topics', topic.id]);
        this.created.emit();
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.message ?? 'Failed to create topic.';
      }
    });
  }
}
