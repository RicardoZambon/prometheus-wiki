import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './core/services/notification.service';
import { NotificationBellComponent } from './shared/components/notification-bell.component';
import { SearchBarComponent } from './shared/components/search-bar.component';
import { HasRoleDirective } from './shared/directives/has-role.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NotificationBellComponent,
    SearchBarComponent,
    HasRoleDirective
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.notificationService.startConnection();
      this.notificationService.loadUnreadCount();
    }
  }

  ngOnDestroy(): void {
    this.notificationService.stopConnection();
  }

  logout(): void {
    this.notificationService.stopConnection();
    this.authService.logout();
  }
}
