using PrometheusWiki.Core.Enums;

namespace PrometheusWiki.Core.Entities;

public class Topic
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public TopicStatus Status { get; set; } = TopicStatus.Open;
    public int ViewCount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<TopicTag> TopicTags { get; set; } = new List<TopicTag>();
    public ICollection<Answer> Answers { get; set; } = new List<Answer>();
}
