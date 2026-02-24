namespace PrometheusWiki.Core.Interfaces.Services;

public class AIAnswerRequest
{
    public string TopicTitle { get; set; } = string.Empty;
    public string TopicContent { get; set; } = string.Empty;
    public string UserLanguage { get; set; } = "en";
    public string? UserContextSummary { get; set; }
    public IEnumerable<string> SimilarTopics { get; set; } = Enumerable.Empty<string>();
    public IEnumerable<string> RelevantWikiPages { get; set; } = Enumerable.Empty<string>();
}

public interface IAIProvider
{
    Task<string> GenerateAnswerAsync(AIAnswerRequest request);
    Task<string> TranslateAsync(string content, string targetLanguage);
}
