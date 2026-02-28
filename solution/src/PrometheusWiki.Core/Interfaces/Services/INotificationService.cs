using PrometheusWiki.Core.Entities;
using PrometheusWiki.Core.Enums;

namespace PrometheusWiki.Core.Interfaces.Services;

public interface INotificationService
{
    Task SendNotificationAsync(int userId, NotificationType type, int referenceId, string referenceType, string message);
    Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId, bool unreadOnly = false);
    Task<int> GetUnreadCountAsync(int userId);
    Task MarkAsReadAsync(int notificationId);
    Task MarkAllAsReadAsync(int userId);
}
