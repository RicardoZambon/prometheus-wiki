namespace PrometheusWiki.Core.Entities;

public class AnswerVote
{
    public int Id { get; set; }
    public int AnswerId { get; set; }
    public Answer Answer { get; set; } = null!;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
