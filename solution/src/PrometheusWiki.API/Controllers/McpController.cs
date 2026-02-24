using Microsoft.AspNetCore.Mvc;
using PrometheusWiki.Core.Entities;
using PrometheusWiki.Core.Interfaces.Repositories;
using PrometheusWiki.Core.Interfaces.Services;

namespace PrometheusWiki.API.Controllers;

[ApiController]
[Route("api/mcp")]
public class McpController : ControllerBase
{
    private readonly ITopicService _topicService;
    private readonly IWikiService _wikiService;
    private readonly IAnswerRepository _answerRepository;
    private readonly IConfiguration _configuration;

    public McpController(
        ITopicService topicService,
        IWikiService wikiService,
        IAnswerRepository answerRepository,
        IConfiguration configuration)
    {
        _topicService = topicService;
        _wikiService = wikiService;
        _answerRepository = answerRepository;
        _configuration = configuration;
    }

    [HttpPost("search_topics")]
    public async Task<IActionResult> SearchTopics([FromBody] McpSearchRequest request)
    {
        if (!ValidateApiKey()) return Unauthorized();
        var topics = await _topicService.SearchAsync(request.Query, null, null, 1, 10);
        return Ok(topics.Select(t => new { t.Id, t.Title, Status = t.Status.ToString() }));
    }

    [HttpGet("get_topic/{id}")]
    public async Task<IActionResult> GetTopic(int id)
    {
        if (!ValidateApiKey()) return Unauthorized();
        var topic = await _topicService.GetByIdAsync(id);
        if (topic == null) return NotFound();
        return Ok(topic);
    }

    [HttpPost("post_answer")]
    public async Task<IActionResult> PostAnswer([FromBody] McpPostAnswerRequest request)
    {
        if (!ValidateApiKey()) return Unauthorized();

        var answer = new Answer
        {
            TopicId = request.TopicId,
            UserId = 1, // System/AI user
            Content = request.Content,
            IsAiGenerated = true,
            AiProvider = "MCP"
        };

        var created = await _answerRepository.CreateAsync(answer);
        return Ok(new { created.Id });
    }

    [HttpPost("search_wiki")]
    public async Task<IActionResult> SearchWiki([FromBody] McpSearchRequest request)
    {
        if (!ValidateApiKey()) return Unauthorized();
        var pages = await _wikiService.SearchAsync(request.Query);
        return Ok(pages.Select(p => new { p.Id, p.Title }));
    }

    [HttpGet("get_wiki_page/{id}")]
    public async Task<IActionResult> GetWikiPage(int id, [FromQuery] string? language)
    {
        if (!ValidateApiKey()) return Unauthorized();
        var page = await _wikiService.GetPageAsync(id);
        if (page == null) return NotFound();
        return Ok(page);
    }

    private bool ValidateApiKey()
    {
        var configuredKey = _configuration["MCP:ApiKey"];
        if (string.IsNullOrEmpty(configuredKey)) return false;

        var providedKey = Request.Headers["X-MCP-API-Key"].FirstOrDefault();
        return providedKey == configuredKey;
    }
}

public class McpSearchRequest
{
    public string Query { get; set; } = string.Empty;
}

public class McpPostAnswerRequest
{
    public int TopicId { get; set; }
    public string Content { get; set; } = string.Empty;
}
