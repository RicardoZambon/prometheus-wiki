using PrometheusWiki.Core.Entities;

namespace PrometheusWiki.Core.Interfaces.Repositories;

public interface IAnswerRepository
{
    Task<Answer?> GetByIdAsync(int id);
    Task<IEnumerable<Answer>> GetByTopicIdAsync(int topicId);
    Task<Answer> CreateAsync(Answer answer);
    Task UpdateAsync(Answer answer);
    Task DeleteAsync(int id);
    Task<bool> HasUserVotedAsync(int answerId, int userId);
    Task AddVoteAsync(AnswerVote vote);
    Task RemoveVoteAsync(int answerId, int userId);
}
