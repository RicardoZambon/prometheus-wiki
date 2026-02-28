using System.ComponentModel.DataAnnotations;

namespace PrometheusWiki.API.DTOs.Requests;

public class CreateTopicRequest
{
    [Required] [MaxLength(300)] public string Title { get; set; } = string.Empty;
    [Required] public string Content { get; set; } = string.Empty;
    [Required] public int CategoryId { get; set; }
    public List<int> TagIds { get; set; } = new();
}
