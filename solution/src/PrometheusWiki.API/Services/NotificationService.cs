using Microsoft.AspNetCore.SignalR;
using PrometheusWiki.API.Hubs;
using PrometheusWiki.Core.Entities;
using PrometheusWiki.Core.Enums;
using PrometheusWiki.Core.Interfaces.Repositories;
using PrometheusWiki.Core.Interfaces.Services;

namespace PrometheusWiki.API.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationService(INotificationRepository notificationRepository, IHubContext<NotificationHub> hubContext)
    {
        _notificationRepository = notificationRepository;
        _hubContext = hubContext;
    }

    public async Task SendNotificationAsync(int userId, NotificationType type, int referenceId, string referenceType, string message)
    {
        var notification = new Notification
        {
            UserId = userId,
            Type = type,
            ReferenceId = referenceId,
            ReferenceType = referenceType,
            Message = message
        };

        await _notificationRepository.CreateAsync(notification);

        // Push real-time notification via SignalR
        await _hubContext.Clients.Group($"user_{userId}")
            .SendAsync("ReceiveNotification", new
            {
                notification.Id,
                Type = notification.Type.ToString(),
                notification.ReferenceId,
                notification.ReferenceType,
                notification.Message,
                notification.CreatedAt
            });
    }

    public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId, bool unreadOnly = false)
    {
        return await _notificationRepository.GetByUserIdAsync(userId, unreadOnly);
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        return await _notificationRepository.GetUnreadCountAsync(userId);
    }

    public async Task MarkAsReadAsync(int notificationId)
    {
        await _notificationRepository.MarkAsReadAsync(notificationId);
    }

    public async Task MarkAllAsReadAsync(int userId)
    {
        await _notificationRepository.MarkAllAsReadAsync(userId);
    }
}
