import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ClickOutsideDirective } from '../directives/click-outside.directive';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [ClickOutsideDirective],
  template: `
    <div class="relative" (appClickOutside)="open = false">
      <button (click)="open = !open"
              class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
          <i class="fa-solid fa-user text-primary-600 dark:text-primary-300 text-sm"></i>
        </div>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline">
          {{ authService.username() }}
        </span>
        <i class="fa-solid fa-chevron-down text-xs text-gray-400"></i>
      </button>

      @if (open) {
        <div class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
            <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ authService.username() }}</div>
            <div class="flex gap-1 mt-1 flex-wrap">
              @for (role of authService.roles(); track role) {
                <span class="px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                  {{ role }}
                </span>
              }
            </div>
          </div>
          <button (click)="onLogout()"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 flex items-center gap-2 transition-colors">
            <i class="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      }
    </div>
  `
})
export class UserMenuComponent {
  authService = inject(AuthService);
  @Output() logout = new EventEmitter<void>();
  open = false;

  onLogout(): void {
    this.open = false;
    this.logout.emit();
  }
}
