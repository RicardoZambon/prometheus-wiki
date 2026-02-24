import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './core/services/notification.service';
import { ThemeService } from './core/services/theme.service';
import { NotificationBellComponent } from './shared/components/notification-bell.component';
import { SearchBarComponent } from './shared/components/search-bar.component';
import { SidebarComponent } from './shared/components/sidebar.component';
import { UserMenuComponent } from './shared/components/user-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NotificationBellComponent,
    SearchBarComponent,
    SidebarComponent,
    UserMenuComponent
  ],
  template: `
    @if (isAuthPage()) {
      <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <router-outlet />
      </div>
    } @else {
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Header -->
        <header class="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 z-50 flex items-center px-4 gap-4">
          <button (click)="toggleSidebar()"
                  class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-colors">
            <i class="fa-solid fa-bars text-lg"></i>
          </button>

          <a routerLink="/" class="flex items-center gap-2 text-lg font-bold text-primary-600 dark:text-primary-400 mr-4 shrink-0">
            <i class="fa-solid fa-fire"></i>
            <span class="hidden sm:inline">Prometheus Wiki</span>
          </a>

          <div class="flex-1 max-w-xl">
            <app-search-bar />
          </div>

          <div class="flex items-center gap-2 ml-auto shrink-0">
            <button (click)="themeService.toggle()"
                    class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-colors"
                    [title]="themeService.isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
              <i [class]="themeService.isDark() ? 'fa-solid fa-sun text-lg' : 'fa-solid fa-moon text-lg'"></i>
            </button>

            @if (authService.isAuthenticated()) {
              <app-notification-bell />
              <app-user-menu (logout)="logout()" />
            } @else {
              <a routerLink="/login"
                 class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                Login
              </a>
            }
          </div>
        </header>

        <!-- Mobile backdrop -->
        @if (!sidebarCollapsed()) {
          <div class="fixed inset-0 bg-black/50 z-30 lg:hidden" (click)="sidebarCollapsed.set(true)"></div>
        }

        <!-- Sidebar + Content -->
        <div class="flex pt-16">
          <app-sidebar [collapsed]="sidebarCollapsed()" />

          <main [class]="sidebarCollapsed()
            ? 'lg:ml-16 flex-1 p-4 lg:p-6 min-h-[calc(100vh-4rem)] transition-all duration-300'
            : 'lg:ml-64 flex-1 p-4 lg:p-6 min-h-[calc(100vh-4rem)] transition-all duration-300'">
            <router-outlet />
          </main>
        </div>
      </div>
    }
  `
})
export class AppComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  sidebarCollapsed = signal(false);
  isAuthPage = signal(false);

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.isAuthPage.set(
        event.url.includes('/login') || event.url.includes('/register')
      );
    });

    if (this.authService.isAuthenticated()) {
      this.notificationService.startConnection();
      this.notificationService.loadUnreadCount();
    }
  }

  ngOnDestroy(): void {
    this.notificationService.stopConnection();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  logout(): void {
    this.notificationService.stopConnection();
    this.authService.logout();
  }
}
