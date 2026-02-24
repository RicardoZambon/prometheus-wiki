namespace PrometheusWiki.Core.Entities;

public class Tag
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;

    public ICollection<TopicTag> TopicTags { get; set; } = new List<TopicTag>();
}
