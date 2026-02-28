using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrometheusWiki.API.DTOs.Requests;
using PrometheusWiki.API.DTOs.Responses;
using PrometheusWiki.Core.Entities;
using PrometheusWiki.Core.Enums;
using PrometheusWiki.Core.Interfaces.Repositories;
using PrometheusWiki.Core.Interfaces.Services;

namespace PrometheusWiki.API.Controllers;

[ApiController]
[Route("api/topics/{topicId}/[controller]")]
public class AnswersController : ControllerBase
{
    private readonly IAnswerRepository _answerRepository;
    private readonly ITopicService _topicService;
    private readonly INotificationService _notificationService;

    public AnswersController(
        IAnswerRepository answerRepository,
        ITopicService topicService,
        INotificationService notificationService)
    {
        _answerRepository = answerRepository;
        _topicService = topicService;
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AnswerResponse>>> GetAnswers(int topicId)
    {
        var answers = await _answerRepository.GetByTopicIdAsync(topicId);
        return Ok(answers.Select(MapToResponse));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<AnswerResponse>> CreateAnswer(int topicId, [FromBody] CreateAnswerRequest request)
    {
        var topic = await _topicService.GetByIdAsync(topicId);
        if (topic == null) return NotFound();

        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Re-open archived topics when new answer is posted
        if (topic.Status == TopicStatus.Archived)
        {
            topic.Status = TopicStatus.Open;
            await _topicService.UpdateAsync(topic);
        }

        var answer = new Answer
        {
            TopicId = topicId,
            UserId = userId,
            Content = request.Content
        };

        var created = await _answerRepository.CreateAsync(answer);

        // Notify topic author
        if (topic.UserId != userId)
        {
            await _notificationService.SendNotificationAsync(
                topic.UserId, NotificationType.NewAnswer,
                topicId, "Topic", $"New answer on your topic \"{topic.Title}\"");
        }

        return CreatedAtAction(nameof(GetAnswers), new { topicId }, MapToResponse(created));
    }

    [Authorize]
    [HttpPost("{answerId}/vote")]
    public async Task<IActionResult> Vote(int topicId, int answerId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        if (await _answerRepository.HasUserVotedAsync(answerId, userId))
        {
            await _answerRepository.RemoveVoteAsync(answerId, userId);
            return Ok(new { voted = false });
        }

        await _answerRepository.AddVoteAsync(new AnswerVote { AnswerId = answerId, UserId = userId });
        return Ok(new { voted = true });
    }

    private static AnswerResponse MapToResponse(Answer answer)
    {
        return new AnswerResponse
        {
            Id = answer.Id,
            Content = answer.Content,
            AuthorUsername = answer.User?.Username ?? "",
            IsSolution = answer.IsSolution,
            IsAiGenerated = answer.IsAiGenerated,
            AiProvider = answer.AiProvider,
            UpvoteCount = answer.UpvoteCount,
            CreatedAt = answer.CreatedAt,
            UpdatedAt = answer.UpdatedAt
        };
    }
}
