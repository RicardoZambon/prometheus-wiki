using System.ComponentModel.DataAnnotations;

namespace PrometheusWiki.API.DTOs.Requests;

public class CreateWikiPageRequest
{
    [Required] [MaxLength(300)] public string Title { get; set; } = string.Empty;
    [Required] public string Content { get; set; } = string.Empty;
    public int? ParentId { get; set; }
    [MaxLength(10)] public string BaseLanguage { get; set; } = "en";
}
