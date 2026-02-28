using System.ComponentModel.DataAnnotations;

namespace PrometheusWiki.API.DTOs.Requests;

public class TranslateWikiPageRequest
{
    [Required] [MaxLength(10)] public string Language { get; set; } = string.Empty;
    [Required] public string Content { get; set; } = string.Empty;
}
