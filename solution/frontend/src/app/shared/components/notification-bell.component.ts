import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { Notification } from '../../core/models/notification.model';
import { ClickOutsideDirective } from '../directives/click-outside.directive';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [ClickOutsideDirective, TimeAgoPipe],
  template: `
    <div class="relative" (appClickOutside)="isOpen = false">
      <button (click)="toggleDropdown()"
              class="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-colors">
        <i class="fa-solid fa-bell text-lg"></i>
        @if (notificationService.unreadCount() > 0) {
          <span class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {{ notificationService.unreadCount() > 99 ? '99+' : notificationService.unreadCount() }}
          </span>
        }
      </button>

      @if (isOpen) {
        <div class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
            @if (notificationService.unreadCount() > 0) {
              <button (click)="notificationService.markAllAsRead()"
                      class="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                Mark all read
              </button>
            }
          </div>

          <div class="max-h-80 overflow-y-auto">
            @for (notification of notificationService.notifications(); track notification.id) {
              <div (click)="onNotificationClick(notification)"
                   [class]="notification.isRead
                     ? 'px-4 py-3 border-b border-gray-50 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                     : 'px-4 py-3 border-b border-gray-50 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 bg-primary-50/50 dark:bg-primary-950/30 transition-colors'">
                <div class="flex items-start gap-3">
                  <i [class]="getNotificationIcon(notification.type)"></i>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-900 dark:text-white">{{ notification.message }}</p>
                    <p class="text-xs text-gray-400 mt-0.5">{{ notification.createdAt | timeAgo }}</p>
                  </div>
                  @if (!notification.isRead) {
                    <div class="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0"></div>
                  }
                </div>
              </div>
            } @empty {
              <div class="px-4 py-8 text-center text-sm text-gray-400">
                <i class="fa-regular fa-bell-slash text-2xl mb-2 block"></i>
                <p>No notifications</p>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class NotificationBellComponent implements OnInit {
  notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private router = inject(Router);
  isOpen = false;

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.notificationService.loadNotifications();
    }
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.notificationService.loadNotifications();
    }
  }

  onNotificationClick(notification: Notification): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id);
    }
    this.isOpen = false;

    if (notification.referenceType === 'Topic') {
      this.router.navigate(['/topics', notification.referenceId]);
    } else if (notification.referenceType === 'WikiPage') {
      this.router.navigate(['/wiki', notification.referenceId]);
    }
  }

  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      'NewAnswer': 'fa-solid fa-comment text-sm mt-0.5 text-blue-500',
      'TopicSolved': 'fa-solid fa-circle-check text-sm mt-0.5 text-green-500',
      'TopicArchived': 'fa-solid fa-box-archive text-sm mt-0.5 text-amber-500',
      'WikiUpdated': 'fa-solid fa-pen text-sm mt-0.5 text-purple-500',
      'AnswerUpvoted': 'fa-solid fa-arrow-up text-sm mt-0.5 text-primary-500'
    };
    return icons[type] || 'fa-solid fa-bell text-sm mt-0.5 text-gray-400';
  }
}
