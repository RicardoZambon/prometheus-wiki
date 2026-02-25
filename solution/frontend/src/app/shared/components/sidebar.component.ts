import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HasRoleDirective } from '../directives/has-role.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, HasRoleDirective],
  template: `
    <aside [class]="collapsed
      ? 'fixed left-0 top-16 bottom-0 w-16 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 overflow-y-auto overflow-x-hidden transition-all duration-300 z-40 hidden lg:block'
      : 'fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 overflow-y-auto overflow-x-hidden transition-all duration-300 z-40'">

      <nav class="p-3 space-y-1">
        @if (!collapsed) {
          <div class="px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Q&A
          </div>
        }
        <a routerLink="/topics" routerLinkActive="!bg-primary-50 !text-primary-700 dark:!bg-primary-950 dark:!text-primary-300"
           class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
           [title]="collapsed ? 'Topics' : ''">
          <i class="fa-solid fa-comments w-5 text-center"></i>
          @if (!collapsed) { <span>Topics</span> }
        </a>

        @if (!collapsed) {
          <div class="px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-4">
            Wiki
          </div>
        }
        <a routerLink="/wiki" routerLinkActive="!bg-primary-50 !text-primary-700 dark:!bg-primary-950 dark:!text-primary-300"
           class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
           [title]="collapsed ? 'Wiki' : ''">
          <i class="fa-solid fa-book w-5 text-center"></i>
          @if (!collapsed) { <span>Pages</span> }
        </a>

        <!-- Users: visible to Admin and UserManager -->
        <div *appHasRole="['Admin', 'UserManager']">
          @if (!collapsed) {
            <div class="px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-4">
              Management
            </div>
          }
          <a routerLink="/admin/users" routerLinkActive="!bg-primary-50 !text-primary-700 dark:!bg-primary-950 dark:!text-primary-300"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
             [title]="collapsed ? 'Users' : ''">
            <i class="fa-solid fa-users w-5 text-center"></i>
            @if (!collapsed) { <span>Users</span> }
          </a>
        </div>

        <!-- Admin-only section: Categories and Settings -->
        <div *appHasRole="'Admin'">
          @if (!collapsed) {
            <div class="px-3 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-4">
              Admin
            </div>
          }
          <a routerLink="/admin/categories" routerLinkActive="!bg-primary-50 !text-primary-700 dark:!bg-primary-950 dark:!text-primary-300"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
             [title]="collapsed ? 'Categories' : ''">
            <i class="fa-solid fa-folder w-5 text-center"></i>
            @if (!collapsed) { <span>Categories</span> }
          </a>
          <a routerLink="/admin/settings" routerLinkActive="!bg-primary-50 !text-primary-700 dark:!bg-primary-950 dark:!text-primary-300"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
             [title]="collapsed ? 'Settings' : ''">
            <i class="fa-solid fa-gear w-5 text-center"></i>
            @if (!collapsed) { <span>Settings</span> }
          </a>
        </div>
      </nav>
    </aside>
  `
})
export class SidebarComponent {
  @Input() collapsed = false;
}
