using PrometheusWiki.Core.Entities;
using PrometheusWiki.Core.Interfaces.Repositories;
using PrometheusWiki.Core.Interfaces.Services;

namespace PrometheusWiki.API.Services;

public class WikiService : IWikiService
{
    private readonly IWikiPageRepository _wikiPageRepository;

    public WikiService(IWikiPageRepository wikiPageRepository)
    {
        _wikiPageRepository = wikiPageRepository;
    }

    public async Task<WikiPage?> GetPageAsync(int id)
    {
        return await _wikiPageRepository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<WikiPage>> GetTreeAsync()
    {
        return await _wikiPageRepository.GetTreeAsync();
    }

    public async Task<IEnumerable<WikiPage>> SearchAsync(string query)
    {
        return await _wikiPageRepository.SearchAsync(query);
    }

    public async Task<WikiPage> CreatePageAsync(WikiPage page, string content)
    {
        var created = await _wikiPageRepository.CreateAsync(page);

        await _wikiPageRepository.CreateVersionAsync(new WikiPageVersion
        {
            WikiPageId = created.Id,
            Content = content,
            ChangedById = page.CreatedById,
            VersionNumber = 1
        });

        return created;
    }

    public async Task<WikiPage> UpdatePageAsync(int id, string content, int changedById)
    {
        var page = await _wikiPageRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Wiki page {id} not found");

        page.UpdatedById = changedById;
        await _wikiPageRepository.UpdateAsync(page);

        var versions = await _wikiPageRepository.GetVersionsAsync(id);
        var nextVersion = versions.Any() ? versions.Max(v => v.VersionNumber) + 1 : 1;

        await _wikiPageRepository.CreateVersionAsync(new WikiPageVersion
        {
            WikiPageId = id,
            Content = content,
            ChangedById = changedById,
            VersionNumber = nextVersion
        });

        // Mark existing translations as outdated
        foreach (var translation in page.Translations)
        {
            translation.IsOutdated = true;
            await _wikiPageRepository.CreateOrUpdateTranslationAsync(translation);
        }

        return page;
    }

    public async Task DeletePageAsync(int id)
    {
        await _wikiPageRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<WikiPageVersion>> GetVersionHistoryAsync(int pageId)
    {
        return await _wikiPageRepository.GetVersionsAsync(pageId);
    }

    public async Task<WikiPageTranslation?> GetTranslationAsync(int pageId, string language)
    {
        return await _wikiPageRepository.GetTranslationAsync(pageId, language);
    }

    public async Task<WikiPageTranslation> TranslatePageAsync(int pageId, string language, string content, int translatedById, bool isAiTranslated)
    {
        var translation = new WikiPageTranslation
        {
            WikiPageId = pageId,
            Language = language,
            Content = content,
            TranslatedById = translatedById,
            IsAiTranslated = isAiTranslated,
            IsOutdated = false
        };

        return await _wikiPageRepository.CreateOrUpdateTranslationAsync(translation);
    }
}
