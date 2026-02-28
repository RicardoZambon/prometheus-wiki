using PrometheusWiki.Core.Entities;

namespace PrometheusWiki.Core.Interfaces.Services;

public interface IWikiService
{
    Task<WikiPage?> GetPageAsync(int id);
    Task<IEnumerable<WikiPage>> GetTreeAsync();
    Task<IEnumerable<WikiPage>> SearchAsync(string query);
    Task<WikiPage> CreatePageAsync(WikiPage page, string content);
    Task<WikiPage> UpdatePageAsync(int id, string content, int changedById);
    Task DeletePageAsync(int id);
    Task<IEnumerable<WikiPageVersion>> GetVersionHistoryAsync(int pageId);
    Task<WikiPageTranslation?> GetTranslationAsync(int pageId, string language);
    Task<WikiPageTranslation> TranslatePageAsync(int pageId, string language, string content, int translatedById, bool isAiTranslated);
}
