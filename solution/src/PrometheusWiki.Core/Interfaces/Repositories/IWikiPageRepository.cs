using PrometheusWiki.Core.Entities;

namespace PrometheusWiki.Core.Interfaces.Repositories;

public interface IWikiPageRepository
{
    Task<WikiPage?> GetByIdAsync(int id);
    Task<IEnumerable<WikiPage>> GetTreeAsync();
    Task<IEnumerable<WikiPage>> SearchAsync(string query);
    Task<WikiPage> CreateAsync(WikiPage page);
    Task UpdateAsync(WikiPage page);
    Task DeleteAsync(int id);
    Task<WikiPageVersion?> GetVersionAsync(int pageId, int versionNumber);
    Task<IEnumerable<WikiPageVersion>> GetVersionsAsync(int pageId);
    Task<WikiPageVersion> CreateVersionAsync(WikiPageVersion version);
    Task<WikiPageTranslation?> GetTranslationAsync(int pageId, string language);
    Task<WikiPageTranslation> CreateOrUpdateTranslationAsync(WikiPageTranslation translation);
}
