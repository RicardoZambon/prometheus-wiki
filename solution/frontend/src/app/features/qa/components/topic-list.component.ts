import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TopicService } from '../services/topic.service';
import { Topic, Category, Tag } from '../../../core/models/topic.model';
import { AuthService } from '../../../core/services/auth.service';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { CreateTopicModalComponent } from './create-topic-modal.component';

@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [RouterLink, FormsModule, TimeAgoPipe, CreateTopicModalComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Q&A Topics</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Ask questions, share knowledge</p>
        </div>
        @if (authService.isAuthenticated()) {
          <button (click)="showCreateModal = true"
                  class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <i class="fa-solid fa-plus"></i> New Topic
          </button>
        }
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div class="relative flex-1 min-w-[200px]">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onFilterChange()" placeholder="Search topics..."
                 class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-primary-500 transition-colors" />
        </div>
        <select [(ngModel)]="selectedCategory" (ngModelChange)="onFilterChange()"
                class="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:border-primary-500 transition-colors">
          <option [ngValue]="null">All Categories</option>
          @for (cat of categories(); track cat.id) {
            <option [ngValue]="cat.id">{{ cat.name }}</option>
          }
        </select>
        <select [(ngModel)]="selectedStatus" (ngModelChange)="onFilterChange()"
                class="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none focus:border-primary-500 transition-colors">
          <option [ngValue]="null">All Status</option>
          <option value="Open">Open</option>
          <option value="Solved">Solved</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      <!-- Topic list -->
      @if (loading()) {
        <div class="flex justify-center py-12">
          <i class="fa-solid fa-spinner fa-spin text-2xl text-primary-500"></i>
        </div>
      } @else {
        <div class="space-y-3">
          @for (topic of topics(); track topic.id) {
            <a [routerLink]="['/topics', topic.id]"
               class="block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
              <div class="flex items-start gap-4">
                <!-- Answer count -->
                <div class="flex flex-col items-center min-w-[56px] py-1">
                  <span class="text-lg font-bold" [class]="topic.answerCount > 0 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'">{{ topic.answerCount }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">answers</span>
                </div>

                <div class="flex-1 min-w-0">
                  <!-- Title + status -->
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ topic.title }}</h3>
                    @switch (topic.status) {
                      @case ('Open') {
                        <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 shrink-0">Open</span>
                      }
                      @case ('Solved') {
                        <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shrink-0">
                          <i class="fa-solid fa-check mr-1"></i>Solved
                        </span>
                      }
                      @case ('Archived') {
                        <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 shrink-0">Archived</span>
                      }
                    }
                  </div>

                  <!-- Category + tags -->
                  <div class="flex items-center gap-2 mb-2 flex-wrap">
                    @if (topic.categoryName) {
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        <i class="fa-solid fa-folder mr-1"></i>{{ topic.categoryName }}
                      </span>
                    }
                    @for (tag of topic.tags; track tag) {
                      <span class="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">{{ tag }}</span>
                    }
                  </div>

                  <!-- Meta -->
                  <div class="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                    <span><i class="fa-solid fa-user mr-1"></i>{{ topic.authorUsername }}</span>
                    <span><i class="fa-regular fa-clock mr-1"></i>{{ topic.createdAt | timeAgo }}</span>
                    <span><i class="fa-solid fa-eye mr-1"></i>{{ topic.viewCount }}</span>
                  </div>
                </div>
              </div>
            </a>
          } @empty {
            <div class="text-center py-12 text-gray-400 dark:text-gray-500">
              <i class="fa-solid fa-comments text-4xl mb-3 block"></i>
              <p class="text-lg font-medium">No topics found</p>
              <p class="text-sm mt-1">Be the first to ask a question!</p>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (topics().length > 0) {
          <div class="flex justify-center items-center gap-2 pt-4">
            <button (click)="prevPage()" [disabled]="currentPage <= 1"
                    class="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              <i class="fa-solid fa-chevron-left mr-1"></i> Previous
            </button>
            <span class="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400">Page {{ currentPage }}</span>
            <button (click)="nextPage()" [disabled]="topics().length < pageSize"
                    class="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Next <i class="fa-solid fa-chevron-right ml-1"></i>
            </button>
          </div>
        }
      }
    </div>

    @if (showCreateModal) {
      <app-create-topic-modal
        [categories]="categories()"
        [tags]="allTags()"
        (close)="showCreateModal = false"
        (created)="onTopicCreated()" />
    }
  `
})
export class TopicListComponent implements OnInit {
  private topicService = inject(TopicService);
  authService = inject(AuthService);

  topics = signal<Topic[]>([]);
  categories = signal<Category[]>([]);
  allTags = signal<Tag[]>([]);
  loading = signal(false);

  searchQuery = '';
  selectedCategory: number | null = null;
  selectedStatus: string | null = null;
  currentPage = 1;
  pageSize = 20;
  showCreateModal = false;

  ngOnInit(): void {
    this.loadTopics();
    this.topicService.getCategories().subscribe(cats => this.categories.set(cats));
    this.topicService.getTags().subscribe(tags => this.allTags.set(tags));
  }

  loadTopics(): void {
    this.loading.set(true);
    this.topicService.getTopics(
      this.searchQuery || undefined,
      this.selectedCategory ?? undefined,
      this.selectedStatus ?? undefined,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: topics => {
        this.topics.set(topics);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadTopics();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTopics();
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.loadTopics();
  }

  onTopicCreated(): void {
    this.showCreateModal = false;
    this.loadTopics();
  }
}
