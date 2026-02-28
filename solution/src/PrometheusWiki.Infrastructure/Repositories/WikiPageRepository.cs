using Microsoft.EntityFrameworkCore;
using PrometheusWiki.Core.Entities;
using PrometheusWiki.Core.Interfaces.Repositories;
using PrometheusWiki.Infrastructure.Data;

namespace PrometheusWiki.Infrastructure.Repositories;

public class WikiPageRepository : IWikiPageRepository
{
    private readonly AppDbContext _context;

    public WikiPageRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<WikiPage?> GetByIdAsync(int id)
    {
        return await _context.WikiPages
            .Include(w => w.CreatedBy)
            .Include(w => w.UpdatedBy)
            .Include(w => w.Children)
            .Include(w => w.Translations)
            .Include(w => w.Versions)
            .FirstOrDefaultAsync(w => w.Id == id);
    }

    public async Task<IEnumerable<WikiPage>> GetTreeAsync()
    {
        return await _context.WikiPages
            .Include(w => w.Children)
            .Where(w => w.ParentId == null)
            .OrderBy(w => w.Title)
            .ToListAsync();
    }

    public async Task<IEnumerable<WikiPage>> SearchAsync(string query)
    {
        return await _context.WikiPages
            .Where(w => EF.Functions.Like(w.Title, $"%{query}%"))
            .OrderBy(w => w.Title)
            .ToListAsync();
    }

    public async Task<WikiPage> CreateAsync(WikiPage page)
    {
        _context.WikiPages.Add(page);
        await _context.SaveChangesAsync();
        return page;
    }

    public async Task UpdateAsync(WikiPage page)
    {
        page.UpdatedAt = DateTime.UtcNow;
        _context.WikiPages.Update(page);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var page = await _context.WikiPages.FindAsync(id);
        if (page != null)
        {
            _context.WikiPages.Remove(page);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<WikiPageVersion?> GetVersionAsync(int pageId, int versionNumber)
    {
        return await _context.WikiPageVersions
            .Include(v => v.ChangedBy)
            .FirstOrDefaultAsync(v => v.WikiPageId == pageId && v.VersionNumber == versionNumber);
    }

    public async Task<IEnumerable<WikiPageVersion>> GetVersionsAsync(int pageId)
    {
        return await _context.WikiPageVersions
            .Include(v => v.ChangedBy)
            .Where(v => v.WikiPageId == pageId)
            .OrderByDescending(v => v.VersionNumber)
            .ToListAsync();
    }

    public async Task<WikiPageVersion> CreateVersionAsync(WikiPageVersion version)
    {
        _context.WikiPageVersions.Add(version);
        await _context.SaveChangesAsync();
        return version;
    }

    public async Task<WikiPageTranslation?> GetTranslationAsync(int pageId, string language)
    {
        return await _context.WikiPageTranslations
            .Include(t => t.TranslatedBy)
            .FirstOrDefaultAsync(t => t.WikiPageId == pageId && t.Language == language);
    }

    public async Task<WikiPageTranslation> CreateOrUpdateTranslationAsync(WikiPageTranslation translation)
    {
        var existing = await _context.WikiPageTranslations
            .FirstOrDefaultAsync(t => t.WikiPageId == translation.WikiPageId && t.Language == translation.Language);

        if (existing != null)
        {
            existing.Content = translation.Content;
            existing.IsOutdated = translation.IsOutdated;
            existing.TranslatedById = translation.TranslatedById;
            existing.IsAiTranslated = translation.IsAiTranslated;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            _context.WikiPageTranslations.Add(translation);
        }

        await _context.SaveChangesAsync();
        return existing ?? translation;
    }
}
