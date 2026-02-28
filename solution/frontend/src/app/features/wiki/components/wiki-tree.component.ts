import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WikiService } from '../services/wiki.service';
import { WikiPageTreeNode } from '../../../core/models/wiki.model';
import { AuthService } from '../../../core/services/auth.service';
import { WikiTreeNodeComponent } from './wiki-tree-node.component';

@Component({
  selector: 'app-wiki-tree',
  standalone: true,
  imports: [RouterLink, WikiTreeNodeComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Wiki</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Knowledge base documentation</p>
        </div>
        @if (authService.hasRole('WikiEditor') || authService.hasRole('Admin')) {
          <a routerLink="/wiki/new"
             class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <i class="fa-solid fa-plus"></i> New Page
          </a>
        }
      </div>

      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        @if (loading()) {
          <div class="flex justify-center py-8">
            <i class="fa-solid fa-spinner fa-spin text-xl text-primary-500"></i>
          </div>
        } @else {
          @for (node of tree(); track node.id) {
            <app-wiki-tree-node [node]="node" [level]="0" />
          } @empty {
            <div class="text-center py-8 text-gray-400 dark:text-gray-500">
              <i class="fa-solid fa-book text-3xl mb-3 block"></i>
              <p class="text-lg font-medium">No wiki pages yet</p>
              <p class="text-sm mt-1">Create the first page to get started</p>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class WikiTreeComponent implements OnInit {
  private wikiService = inject(WikiService);
  authService = inject(AuthService);

  tree = signal<WikiPageTreeNode[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.wikiService.getTree().subscribe({
      next: tree => {
        this.tree.set(tree);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
