using PrometheusWiki.Core.Entities;
using PrometheusWiki.Core.Enums;

namespace PrometheusWiki.Core.Interfaces.Repositories;

public interface ITopicRepository
{
    Task<Topic?> GetByIdAsync(int id);
    Task<IEnumerable<Topic>> GetAllAsync(int page, int pageSize);
    Task<IEnumerable<Topic>> SearchAsync(string query, int? categoryId, TopicStatus? status, int page, int pageSize);
    Task<IEnumerable<Topic>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Topic>> GetStaleOpenTopicsAsync(int timeoutDays);
    Task<Topic> CreateAsync(Topic topic);
    Task UpdateAsync(Topic topic);
    Task DeleteAsync(int id);
}
