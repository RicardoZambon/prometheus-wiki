using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrometheusWiki.API.DTOs.Requests;
using PrometheusWiki.API.DTOs.Responses;
using PrometheusWiki.Core.Entities;
using PrometheusWiki.Core.Interfaces.Services;

namespace PrometheusWiki.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WikiPagesController : ControllerBase
{
    private readonly IWikiService _wikiService;

    public WikiPagesController(IWikiService wikiService)
    {
        _wikiService = wikiService;
    }

    [HttpGet("tree")]
    public async Task<ActionResult<IEnumerable<WikiPageTreeNode>>> GetTree()
    {
        var pages = await _wikiService.GetTreeAsync();
        return Ok(pages.Select(MapToTreeNode));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WikiPageResponse>> GetPage(int id, [FromQuery] string? language)
    {
        var page = await _wikiService.GetPageAsync(id);
        if (page == null) return NotFound();

        var response = MapToResponse(page);

        if (!string.IsNullOrEmpty(language) && language != page.BaseLanguage)
        {
            var translation = await _wikiService.GetTranslationAsync(id, language);
            if (translation != null)
                response.Content = translation.Content;
        }

        return Ok(response);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<WikiPageResponse>>> Search([FromQuery] string query)
    {
        var pages = await _wikiService.SearchAsync(query);
        return Ok(pages.Select(MapToResponse));
    }

    [Authorize(Roles = "WikiEditor,Admin")]
    [HttpPost]
    public async Task<ActionResult<WikiPageResponse>> CreatePage([FromBody] CreateWikiPageRequest request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var page = new WikiPage
        {
            Title = request.Title,
            ParentId = request.ParentId,
            BaseLanguage = request.BaseLanguage,
            CreatedById = userId,
            UpdatedById = userId
        };

        var created = await _wikiService.CreatePageAsync(page, request.Content);
        return CreatedAtAction(nameof(GetPage), new { id = created.Id }, MapToResponse(created));
    }

    [Authorize(Roles = "WikiEditor,Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<WikiPageResponse>> UpdatePage(int id, [FromBody] UpdateWikiPageRequest request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var page = await _wikiService.UpdatePageAsync(id, request.Content, userId);
        return Ok(MapToResponse(page));
    }

    [HttpGet("{id}/versions")]
    public async Task<ActionResult<IEnumerable<object>>> GetVersions(int id)
    {
        var versions = await _wikiService.GetVersionHistoryAsync(id);
        return Ok(versions.Select(v => new
        {
            v.Id,
            v.VersionNumber,
            v.ChangedBy?.Username,
            v.CreatedAt
        }));
    }

    [Authorize]
    [HttpPost("{id}/translate")]
    public async Task<IActionResult> TranslatePage(int id, [FromBody] TranslateWikiPageRequest request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _wikiService.TranslatePageAsync(id, request.Language, request.Content, userId, isAiTranslated: false);
        return Ok();
    }

    private static WikiPageResponse MapToResponse(WikiPage page)
    {
        return new WikiPageResponse
        {
            Id = page.Id,
            Title = page.Title,
            Content = page.Versions?.OrderByDescending(v => v.VersionNumber).FirstOrDefault()?.Content,
            ParentId = page.ParentId,
            BaseLanguage = page.BaseLanguage,
            CreatedByUsername = page.CreatedBy?.Username ?? "",
            UpdatedByUsername = page.UpdatedBy?.Username ?? "",
            Children = page.Children?.Select(MapToTreeNode).ToList() ?? new(),
            AvailableLanguages = page.Translations?.Select(t => t.Language).ToList() ?? new(),
            CreatedAt = page.CreatedAt,
            UpdatedAt = page.UpdatedAt
        };
    }

    private static WikiPageTreeNode MapToTreeNode(WikiPage page)
    {
        return new WikiPageTreeNode
        {
            Id = page.Id,
            Title = page.Title,
            ParentId = page.ParentId,
            Children = page.Children?.Select(MapToTreeNode).ToList() ?? new()
        };
    }
}
