namespace PrometheusWiki.API.DTOs.Responses;

public class WikiPageResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public int? ParentId { get; set; }
    public string BaseLanguage { get; set; } = string.Empty;
    public string CreatedByUsername { get; set; } = string.Empty;
    public string UpdatedByUsername { get; set; } = string.Empty;
    public List<WikiPageTreeNode> Children { get; set; } = new();
    public List<string> AvailableLanguages { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class WikiPageTreeNode
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int? ParentId { get; set; }
    public List<WikiPageTreeNode> Children { get; set; } = new();
}
