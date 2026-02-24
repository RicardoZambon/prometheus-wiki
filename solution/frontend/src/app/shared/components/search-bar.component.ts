import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, debounceTime, switchMap, of, forkJoin } from 'rxjs';
import { TopicService } from '../../features/qa/services/topic.service';
import { WikiService } from '../../features/wiki/services/wiki.service';
import { Topic } from '../../core/models/topic.model';
import { WikiPage } from '../../core/models/wiki.model';
import { ClickOutsideDirective } from '../directives/click-outside.directive';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, RouterLink, ClickOutsideDirective],
  template: `
    <div class="relative w-full" (appClickOutside)="showResults = false">
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        <input type="text" [(ngModel)]="query" placeholder="Search topics & wiki..."
               (input)="onQueryChange()" (focus)="onFocus()" (keyup.enter)="onSearch()"
               class="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-colors" />
      </div>

      @if (showResults && (topicResults().length > 0 || wikiResults().length > 0)) {
        <div class="absolute top-full mt-1 w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto z-50">
          @if (topicResults().length > 0) {
            <div class="px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">Topics</div>
            @for (topic of topicResults(); track topic.id) {
              <a [routerLink]="['/topics', topic.id]" (click)="showResults = false"
                 class="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ topic.title }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ topic.categoryName }}</div>
              </a>
            }
          }
          @if (wikiResults().length > 0) {
            <div class="px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase"
                 [class.border-t]="topicResults().length > 0"
                 [class.border-gray-100]="topicResults().length > 0"
                 [class.dark:border-gray-800]="topicResults().length > 0">Wiki Pages</div>
            @for (page of wikiResults(); track page.id) {
              <a [routerLink]="['/wiki', page.id]" (click)="showResults = false"
                 class="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ page.title }}</div>
              </a>
            }
          }
        </div>
      }
    </div>
  `
})
export class SearchBarComponent {
  private topicService = inject(TopicService);
  private wikiService = inject(WikiService);
  private router = inject(Router);
  private searchSubject = new Subject<string>();

  query = '';
  showResults = false;
  topicResults = signal<Topic[]>([]);
  wikiResults = signal<WikiPage[]>([]);

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap(query => {
        if (!query || query.length < 2) {
          return of({ topics: [] as Topic[], wiki: [] as WikiPage[] });
        }
        return forkJoin({
          topics: this.topicService.getTopics(query, undefined, undefined, 1, 5),
          wiki: this.wikiService.search(query)
        });
      })
    ).subscribe(results => {
      this.topicResults.set(results.topics);
      this.wikiResults.set(Array.isArray(results.wiki) ? results.wiki.slice(0, 5) : []);
      this.showResults = true;
    });
  }

  onQueryChange(): void {
    this.searchSubject.next(this.query);
  }

  onFocus(): void {
    if (this.topicResults().length > 0 || this.wikiResults().length > 0) {
      this.showResults = true;
    }
  }

  onSearch(): void {
    if (this.query.trim()) {
      this.showResults = false;
      this.router.navigate(['/topics'], { queryParams: { q: this.query } });
    }
  }
}
