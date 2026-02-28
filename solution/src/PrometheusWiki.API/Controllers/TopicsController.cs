using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrometheusWiki.API.DTOs.Requests;
using PrometheusWiki.API.DTOs.Responses;
using PrometheusWiki.Core.Entities;
using PrometheusWiki.Core.Enums;
using PrometheusWiki.Core.Interfaces.Services;

namespace PrometheusWiki.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TopicsController : ControllerBase
{
    private readonly ITopicService _topicService;

    public TopicsController(ITopicService topicService)
    {
        _topicService = topicService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TopicResponse>>> GetTopics(
        [FromQuery] string? query,
        [FromQuery] int? categoryId,
        [FromQuery] TopicStatus? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var topics = await _topicService.SearchAsync(query, categoryId, status, page, pageSize);
        return Ok(topics.Select(MapToResponse));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TopicResponse>> GetTopic(int id)
    {
        var topic = await _topicService.GetByIdAsync(id);
        if (topic == null) return NotFound();

        await _topicService.IncrementViewCountAsync(id);
        return Ok(MapToResponse(topic));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<TopicResponse>> CreateTopic([FromBody] CreateTopicRequest request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var topic = new Topic
        {
            Title = request.Title,
            Content = request.Content,
            UserId = userId,
            CategoryId = request.CategoryId
        };

        var created = await _topicService.CreateAsync(topic, request.TagIds);
        return CreatedAtAction(nameof(GetTopic), new { id = created.Id }, MapToResponse(created));
    }

    [Authorize]
    [HttpPost("{id}/solve")]
    public async Task<IActionResult> MarkAsSolved(int id, [FromQuery] int answerId)
    {
        var topic = await _topicService.GetByIdAsync(id);
        if (topic == null) return NotFound();

        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (topic.UserId != userId)
            return Forbid();

        await _topicService.MarkAsSolvedAsync(id, answerId);
        return NoContent();
    }

    private static TopicResponse MapToResponse(Topic topic)
    {
        return new TopicResponse
        {
            Id = topic.Id,
            Title = topic.Title,
            Content = topic.Content,
            Status = topic.Status.ToString(),
            ViewCount = topic.ViewCount,
            AuthorUsername = topic.User?.Username ?? "",
            CategoryName = topic.Category?.Name ?? "",
            Tags = topic.TopicTags?.Select(tt => tt.Tag?.Name ?? "").Where(n => n != "").ToList() ?? new(),
            AnswerCount = topic.Answers?.Count ?? 0,
            CreatedAt = topic.CreatedAt,
            UpdatedAt = topic.UpdatedAt
        };
    }
}
