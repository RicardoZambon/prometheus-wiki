namespace PrometheusWiki.Core.Entities;

public class WikiPageVersion
{
    public int Id { get; set; }
    public int WikiPageId { get; set; }
    public WikiPage WikiPage { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public int ChangedById { get; set; }
    public User ChangedBy { get; set; } = null!;
    public int VersionNumber { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
