namespace PrometheusWiki.Core.Entities;

public class WikiPage
{
    public int Id { get; set; }
    public int? ParentId { get; set; }
    public WikiPage? Parent { get; set; }
    public string Title { get; set; } = string.Empty;
    public string BaseLanguage { get; set; } = "en";
    public int CreatedById { get; set; }
    public User CreatedBy { get; set; } = null!;
    public int UpdatedById { get; set; }
    public User UpdatedBy { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<WikiPage> Children { get; set; } = new List<WikiPage>();
    public ICollection<WikiPageVersion> Versions { get; set; } = new List<WikiPageVersion>();
    public ICollection<WikiPageTranslation> Translations { get; set; } = new List<WikiPageTranslation>();
}
