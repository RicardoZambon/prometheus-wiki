using PrometheusWiki.Core.Entities;
using PrometheusWiki.Core.Enums;
using PrometheusWiki.Core.Interfaces.Repositories;
using PrometheusWiki.Core.Interfaces.Services;

namespace PrometheusWiki.API.Services;

public class TopicService : ITopicService
{
    private readonly ITopicRepository _topicRepository;
    private readonly IAnswerRepository _answerRepository;
    private readonly INotificationService _notificationService;

    public TopicService(
        ITopicRepository topicRepository,
        IAnswerRepository answerRepository,
        INotificationService notificationService)
    {
        _topicRepository = topicRepository;
        _answerRepository = answerRepository;
        _notificationService = notificationService;
    }

    public async Task<Topic?> GetByIdAsync(int id)
    {
        return await _topicRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Topic>> SearchAsync(string? query, int? categoryId, TopicStatus? status, int page, int pageSize)
    {
        if (string.IsNullOrWhiteSpace(query) && !categoryId.HasValue && !status.HasValue)
            return await _topicRepository.GetAllAsync(page, pageSize);

        return await _topicRepository.SearchAsync(query ?? "", categoryId, status, page, pageSize);
    }

    public async Task<Topic> CreateAsync(Topic topic, IEnumerable<int> tagIds)
    {
        topic.TopicTags = tagIds.Select(id => new TopicTag { TagId = id }).ToList();
        return await _topicRepository.CreateAsync(topic);
    }

    public async Task UpdateAsync(Topic topic)
    {
        await _topicRepository.UpdateAsync(topic);
    }

    public async Task MarkAsSolvedAsync(int topicId, int answerId)
    {
        var topic = await _topicRepository.GetByIdAsync(topicId);
        if (topic == null) return;

        topic.Status = TopicStatus.Solved;
        await _topicRepository.UpdateAsync(topic);

        var answer = await _answerRepository.GetByIdAsync(answerId);
        if (answer != null)
        {
            answer.IsSolution = true;
            await _answerRepository.UpdateAsync(answer);
        }
    }

    public async Task ArchiveStaleTopicsAsync(int timeoutDays)
    {
        var staleTopics = await _topicRepository.GetStaleOpenTopicsAsync(timeoutDays);
        foreach (var topic in staleTopics)
        {
            topic.Status = TopicStatus.Archived;
            await _topicRepository.UpdateAsync(topic);
            await _notificationService.SendNotificationAsync(
                topic.UserId, NotificationType.TopicArchived,
                topic.Id, "Topic", $"Your topic \"{topic.Title}\" has been archived due to inactivity.");
        }
    }

    public async Task IncrementViewCountAsync(int topicId)
    {
        var topic = await _topicRepository.GetByIdAsync(topicId);
        if (topic != null)
        {
            topic.ViewCount++;
            await _topicRepository.UpdateAsync(topic);
        }
    }
}
