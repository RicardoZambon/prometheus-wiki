namespace PrometheusWiki.API.DTOs.Responses;

public class AnswerResponse
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public string AuthorUsername { get; set; } = string.Empty;
    public bool IsSolution { get; set; }
    public bool IsAiGenerated { get; set; }
    public string? AiProvider { get; set; }
    public int UpvoteCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
