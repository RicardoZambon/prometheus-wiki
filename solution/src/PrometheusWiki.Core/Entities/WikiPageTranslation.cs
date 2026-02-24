namespace PrometheusWiki.Core.Entities;

public class WikiPageTranslation
{
    public int Id { get; set; }
    public int WikiPageId { get; set; }
    public WikiPage WikiPage { get; set; } = null!;
    public string Language { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsOutdated { get; set; }
    public int TranslatedById { get; set; }
    public User TranslatedBy { get; set; } = null!;
    public bool IsAiTranslated { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
