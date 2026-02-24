import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { Notification } from '../models/notification.model';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly apiUrl = `${environment.apiUrl}/notifications`;
  private hubConnection: signalR.HubConnection | null = null;

  readonly notifications = signal<Notification[]>([]);
  readonly unreadCount = signal(0);

  constructor(private http: HttpClient, private authService: AuthService) {}

  startConnection(): void {
    const token = this.authService.getToken();
    if (!token) return;

    const parsed = JSON.parse(token);
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl.replace('/api', '')}/hubs/notifications`, {
        accessTokenFactory: () => parsed.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      this.notifications.update(list => [notification, ...list]);
      this.unreadCount.update(count => count + 1);
    });

    this.hubConnection.start().catch(err => console.error('SignalR connection error:', err));
  }

  stopConnection(): void {
    this.hubConnection?.stop();
  }

  loadNotifications(unreadOnly = false): void {
    this.http.get<Notification[]>(`${this.apiUrl}?unreadOnly=${unreadOnly}`)
      .subscribe(notifications => this.notifications.set(notifications));
  }

  loadUnreadCount(): void {
    this.http.get<number>(`${this.apiUrl}/count`)
      .subscribe(count => this.unreadCount.set(count));
  }

  markAsRead(id: number): void {
    this.http.post(`${this.apiUrl}/${id}/read`, {}).subscribe(() => {
      this.notifications.update(list =>
        list.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      this.unreadCount.update(count => Math.max(0, count - 1));
    });
  }

  markAllAsRead(): void {
    this.http.post(`${this.apiUrl}/read-all`, {}).subscribe(() => {
      this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
      this.unreadCount.set(0);
    });
  }
}
