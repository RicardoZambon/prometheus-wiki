import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WikiPageTreeNode } from '../../../core/models/wiki.model';

@Component({
  selector: 'app-wiki-tree-node',
  standalone: true,
  imports: [RouterLink, WikiTreeNodeComponent],
  template: `
    <div [style.padding-left.px]="level * 20">
      <div class="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
        @if (node.children && node.children.length > 0) {
          <button (click)="expanded = !expanded" class="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <i [class]="expanded ? 'fa-solid fa-chevron-down text-xs' : 'fa-solid fa-chevron-right text-xs'"></i>
          </button>
        } @else {
          <span class="w-4"></span>
        }
        <i class="fa-solid fa-file-lines text-sm text-gray-400 dark:text-gray-500"></i>
        <a [routerLink]="['/wiki', node.id]"
           class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 flex-1 transition-colors">
          {{ node.title }}
        </a>
      </div>

      @if (expanded && node.children) {
        @for (child of node.children; track child.id) {
          <app-wiki-tree-node [node]="child" [level]="level + 1" />
        }
      }
    </div>
  `
})
export class WikiTreeNodeComponent {
  @Input({ required: true }) node!: WikiPageTreeNode;
  @Input() level = 0;
  expanded = false;
}
