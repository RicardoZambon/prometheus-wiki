namespace PrometheusWiki.Core.Entities;

public class Answer
{
    public int Id { get; set; }
    public int TopicId { get; set; }
    public Topic Topic { get; set; } = null!;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
    public bool IsSolution { get; set; }
    public bool IsAiGenerated { get; set; }
    public string? AiProvider { get; set; }
    public int UpvoteCount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<AnswerVote> Votes { get; set; } = new List<AnswerVote>();
}
