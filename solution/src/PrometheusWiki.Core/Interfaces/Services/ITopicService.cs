using PrometheusWiki.Core.Entities;
using PrometheusWiki.Core.Enums;

namespace PrometheusWiki.Core.Interfaces.Services;

public interface ITopicService
{
    Task<Topic?> GetByIdAsync(int id);
    Task<IEnumerable<Topic>> SearchAsync(string? query, int? categoryId, TopicStatus? status, int page, int pageSize);
    Task<Topic> CreateAsync(Topic topic, IEnumerable<int> tagIds);
    Task UpdateAsync(Topic topic);
    Task MarkAsSolvedAsync(int topicId, int answerId);
    Task ArchiveStaleTopicsAsync(int timeoutDays);
    Task IncrementViewCountAsync(int topicId);
}
