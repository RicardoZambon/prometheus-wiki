import { Component, inject } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  template: `
    <button class="notification-bell" (click)="toggleDropdown()">
      🔔
      @if (notificationService.unreadCount() > 0) {
        <span class="badge">{{ notificationService.unreadCount() }}</span>
      }
    </button>
  `,
  styles: [`
    .notification-bell { position: relative; background: none; border: none; cursor: pointer; font-size: 1.2rem; }
    .badge { position: absolute; top: -5px; right: -5px; background: #e74c3c; color: white; border-radius: 50%; padding: 2px 6px; font-size: 0.7rem; }
  `]
})
export class NotificationBellComponent {
  notificationService = inject(NotificationService);

  toggleDropdown(): void {
    // TODO: Implement dropdown with notification list
  }
}
