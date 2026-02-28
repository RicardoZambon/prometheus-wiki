import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { WikiService } from '../services/wiki.service';
import { WikiPage } from '../../../core/models/wiki.model';
import { AuthService } from '../../../core/services/auth.service';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

interface WikiVersion {
  id: number;
  versionNumber: number;
  username: string;
  createdAt: string;
}

@Component({
  selector: 'app-wiki-page',
  standalone: true,
  imports: [RouterLink, FormsModule, TimeAgoPipe],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      @if (loading()) {
        <div class="flex justify-center py-12">
          <i class="fa-solid fa-spinner fa-spin text-2xl text-primary-500"></i>
        </div>
      } @else if (page()) {
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
          <a routerLink="/wiki" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <i class="fa-solid fa-book mr-1"></i>Wiki
          </a>
          <i class="fa-solid fa-chevron-right text-xs text-gray-300 dark:text-gray-600"></i>
          <span class="text-gray-900 dark:text-white font-medium">{{ page()!.title }}</span>
        </nav>

        <!-- Page content -->
        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div class="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ page()!.title }}</h1>
            <div class="flex items-center gap-2">
              @if (page()!.availableLanguages.length > 0) {
                <select [ngModel]="selectedLanguage" (ngModelChange)="changeLanguage($event)"
                        class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none">
                  <option [value]="page()!.baseLanguage">{{ page()!.baseLanguage }} (original)</option>
                  @for (lang of page()!.availableLanguages; track lang) {
                    <option [value]="lang">{{ lang }}</option>
                  }
                </select>
              }

              @if (authService.hasRole('WikiEditor') || authService.hasRole('Admin')) {
                <a [routerLink]="['/wiki', page()!.id, 'edit']"
                   class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center gap-1.5 text-gray-700 dark:text-gray-300 transition-colors">
                  <i class="fa-solid fa-pen-to-square"></i> Edit
                </a>
              }

              <button (click)="showVersions = !showVersions"
                      [class]="showVersions
                        ? 'px-3 py-1.5 text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg flex items-center gap-1.5 transition-colors'
                        : 'px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center gap-1.5 text-gray-700 dark:text-gray-300 transition-colors'">
                <i class="fa-solid fa-clock-rotate-left"></i> History
              </button>
            </div>
          </div>

          <!-- Meta -->
          <div class="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800 flex-wrap">
            @if (page()!.createdByUsername) {
              <span><i class="fa-solid fa-user mr-1"></i>Created by {{ page()!.createdByUsername }}</span>
            }
            @if (page()!.updatedByUsername) {
              <span><i class="fa-solid fa-pen mr-1"></i>Updated by {{ page()!.updatedByUsername }}</span>
            }
            <span><i class="fa-regular fa-clock mr-1"></i>{{ page()!.updatedAt | timeAgo }}</span>
          </div>

          <!-- Content -->
          @if (page()!.content) {
            <div class="prose dark:text-gray-300 max-w-none" [innerHTML]="renderedContent()"></div>
          } @else {
            <div class="text-center py-8 text-gray-400 dark:text-gray-500">
              <i class="fa-solid fa-file-pen text-3xl mb-3 block"></i>
              <p>This page has no content yet.</p>
            </div>
          }
        </div>

        <!-- Version history -->
        @if (showVersions) {
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <i class="fa-solid fa-clock-rotate-left mr-2 text-gray-400"></i>Version History
            </h3>
            @if (versions().length > 0) {
              <div class="space-y-1">
                @for (version of versions(); track version.id) {
                  <div class="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div class="flex items-center gap-3">
                      <span class="text-sm font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        v{{ version.versionNumber }}
                      </span>
                      <span class="text-sm text-gray-700 dark:text-gray-300">{{ version.username }}</span>
                    </div>
                    <span class="text-xs text-gray-400 dark:text-gray-500">{{ version.createdAt | timeAgo }}</span>
                  </div>
                }
              </div>
            } @else {
              <p class="text-sm text-gray-400 dark:text-gray-500">No version history available.</p>
            }
          </div>
        }

        <!-- Child pages -->
        @if (page()!.children && page()!.children.length > 0) {
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              <i class="fa-solid fa-sitemap mr-2 text-gray-400"></i>Sub-pages
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              @for (child of page()!.children; track child.id) {
                <a [routerLink]="['/wiki', child.id]"
                   class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                  <i class="fa-solid fa-file-lines text-gray-400 dark:text-gray-500"></i>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ child.title }}</span>
                </a>
              }
            </div>
          </div>
        }
      } @else {
        <div class="text-center py-12 text-gray-400 dark:text-gray-500">
          <i class="fa-solid fa-circle-exclamation text-4xl mb-3 block"></i>
          <p class="text-lg font-medium">Page not found</p>
        </div>
      }
    </div>
  `
})
export class WikiPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private wikiService = inject(WikiService);
  private sanitizer = inject(DomSanitizer);
  authService = inject(AuthService);

  page = signal<WikiPage | null>(null);
  versions = signal<WikiVersion[]>([]);
  loading = signal(true);
  showVersions = false;
  selectedLanguage = '';

  renderedContent = computed(() => {
    const content = this.page()?.content;
    if (!content) return '';
    const html = marked.parse(content, { async: false }) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadPage(id);
        this.loadVersions(id);
      }
    });
  }

  changeLanguage(language: string): void {
    this.selectedLanguage = language;
    const id = this.page()!.id;
    const lang = language === this.page()!.baseLanguage ? undefined : language;
    this.wikiService.getPage(id, lang).subscribe({
      next: page => this.page.set(page)
    });
  }

  private loadPage(id: number): void {
    this.loading.set(true);
    this.wikiService.getPage(id).subscribe({
      next: page => {
        this.page.set(page);
        this.selectedLanguage = page.baseLanguage;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private loadVersions(id: number): void {
    this.wikiService.getVersions(id).subscribe({
      next: versions => this.versions.set(versions)
    });
  }
}
