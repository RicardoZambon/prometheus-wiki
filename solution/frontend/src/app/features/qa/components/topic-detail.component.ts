import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { TopicService } from '../services/topic.service';
import { Topic, Answer } from '../../../core/models/topic.model';
import { AuthService } from '../../../core/services/auth.service';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { RichEditorComponent } from '../../../shared/components/rich-editor.component';

@Component({
  selector: 'app-topic-detail',
  standalone: true,
  imports: [RouterLink, FormsModule, TimeAgoPipe, RichEditorComponent],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      @if (loading()) {
        <div class="flex justify-center py-12">
          <i class="fa-solid fa-spinner fa-spin text-2xl text-primary-500"></i>
        </div>
      } @else if (topic()) {
        <!-- Back link -->
        <a routerLink="/topics" class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          <i class="fa-solid fa-arrow-left"></i> Back to Topics
        </a>

        <!-- Topic card -->
        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div class="flex items-center gap-2 mb-3 flex-wrap">
            @switch (topic()!.status) {
              @case ('Open') {
                <span class="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Open</span>
              }
              @case ('Solved') {
                <span class="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  <i class="fa-solid fa-check mr-1"></i>Solved
                </span>
              }
              @case ('Archived') {
                <span class="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">Archived</span>
              }
            }
            @if (topic()!.categoryName) {
              <span class="text-sm text-gray-500 dark:text-gray-400">
                <i class="fa-solid fa-folder mr-1"></i>{{ topic()!.categoryName }}
              </span>
            }
          </div>

          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ topic()!.title }}</h1>

          <div class="prose dark:text-gray-300 max-w-none" [innerHTML]="renderedContent()"></div>

          <!-- Tags -->
          @if (topic()!.tags.length > 0) {
            <div class="flex gap-1.5 mt-4 flex-wrap">
              @for (tag of topic()!.tags; track tag) {
                <span class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md">{{ tag }}</span>
              }
            </div>
          }

          <!-- Meta -->
          <div class="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
            <span><i class="fa-solid fa-user mr-1"></i>{{ topic()!.authorUsername }}</span>
            <span><i class="fa-regular fa-clock mr-1"></i>{{ topic()!.createdAt | timeAgo }}</span>
            <span><i class="fa-solid fa-eye mr-1"></i>{{ topic()!.viewCount }} views</span>
          </div>
        </div>

        <!-- Answers section -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ answers().length }} {{ answers().length === 1 ? 'Answer' : 'Answers' }}
          </h2>

          @for (answer of answers(); track answer.id) {
            <div [class]="answer.isSolution
              ? 'bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border-2 border-emerald-300 dark:border-emerald-700 p-5'
              : 'bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5'">
              <div class="flex gap-4">
                <!-- Vote column -->
                <div class="flex flex-col items-center gap-1">
                  @if (authService.isAuthenticated()) {
                    <button (click)="vote(answer)" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <i class="fa-solid fa-caret-up text-xl text-gray-400 hover:text-primary-500"></i>
                    </button>
                  }
                  <span class="text-sm font-bold text-gray-700 dark:text-gray-300">{{ answer.upvoteCount }}</span>
                  @if (answer.isSolution) {
                    <i class="fa-solid fa-circle-check text-emerald-500 text-lg mt-1" title="Accepted solution"></i>
                  }
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  @if (answer.isSolution) {
                    <div class="flex items-center gap-1 mb-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      <i class="fa-solid fa-circle-check"></i> Accepted Solution
                    </div>
                  }
                  @if (answer.isAiGenerated) {
                    <div class="flex items-center gap-1 mb-2 text-sm text-purple-600 dark:text-purple-400">
                      <i class="fa-solid fa-robot"></i> AI-generated{{ answer.aiProvider ? ' (' + answer.aiProvider + ')' : '' }}
                    </div>
                  }

                  <div class="prose dark:text-gray-300 max-w-none text-sm" [innerHTML]="renderMarkdown(answer.content)"></div>

                  <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex-wrap gap-2">
                    <div class="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                      <span><i class="fa-solid fa-user mr-1"></i>{{ answer.authorUsername }}</span>
                      <span>{{ answer.createdAt | timeAgo }}</span>
                    </div>

                    @if (canMarkSolution() && !answer.isSolution) {
                      <button (click)="markAsSolution(answer.id)"
                              class="text-xs px-3 py-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors flex items-center gap-1">
                        <i class="fa-solid fa-check"></i> Mark as Solution
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>
          } @empty {
            <div class="text-center py-8 text-gray-400 dark:text-gray-500">
              <i class="fa-solid fa-comment-slash text-3xl mb-3 block"></i>
              <p>No answers yet. Be the first to help!</p>
            </div>
          }
        </div>

        <!-- Create answer form -->
        @if (authService.isAuthenticated()) {
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Your Answer</h3>
            <app-rich-editor [(ngModel)]="newAnswerContent" placeholder="Write your answer..." minHeight="150px"></app-rich-editor>
            <div class="flex justify-end mt-3">
              <button (click)="submitAnswer()" [disabled]="!newAnswerContent.trim() || submitting()"
                      class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors">
                @if (submitting()) { <i class="fa-solid fa-spinner fa-spin"></i> }
                Post Answer
              </button>
            </div>
          </div>
        }
      } @else {
        <div class="text-center py-12 text-gray-400 dark:text-gray-500">
          <i class="fa-solid fa-circle-exclamation text-4xl mb-3 block"></i>
          <p class="text-lg font-medium">Topic not found</p>
        </div>
      }
    </div>
  `
})
export class TopicDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private topicService = inject(TopicService);
  private sanitizer = inject(DomSanitizer);
  authService = inject(AuthService);

  topic = signal<Topic | null>(null);
  answers = signal<Answer[]>([]);
  loading = signal(true);
  submitting = signal(false);
  newAnswerContent = '';

  renderedContent = computed(() => {
    const content = this.topic()?.content;
    if (!content) return '';
    return this.renderMarkdown(content);
  });

  canMarkSolution = computed(() => {
    const t = this.topic();
    return t && t.status === 'Open' && t.authorUsername === this.authService.username();
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadTopic(id);
      this.loadAnswers(id);
    }
  }

  renderMarkdown(content: string): SafeHtml {
    const html = marked.parse(content, { async: false }) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  vote(answer: Answer): void {
    const topicId = this.topic()!.id;
    this.topicService.voteAnswer(topicId, answer.id).subscribe({
      next: () => this.loadAnswers(topicId)
    });
  }

  markAsSolution(answerId: number): void {
    const topicId = this.topic()!.id;
    this.topicService.markAsSolved(topicId, answerId).subscribe({
      next: () => {
        this.loadTopic(topicId);
        this.loadAnswers(topicId);
      }
    });
  }

  submitAnswer(): void {
    const topicId = this.topic()!.id;
    if (!this.newAnswerContent.trim()) return;

    this.submitting.set(true);
    this.topicService.createAnswer(topicId, this.newAnswerContent).subscribe({
      next: () => {
        this.newAnswerContent = '';
        this.submitting.set(false);
        this.loadAnswers(topicId);
      },
      error: () => this.submitting.set(false)
    });
  }

  private loadTopic(id: number): void {
    this.topicService.getTopic(id).subscribe({
      next: topic => {
        this.topic.set(topic);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private loadAnswers(topicId: number): void {
    this.topicService.getAnswers(topicId).subscribe({
      next: answers => this.answers.set(answers)
    });
  }
}
