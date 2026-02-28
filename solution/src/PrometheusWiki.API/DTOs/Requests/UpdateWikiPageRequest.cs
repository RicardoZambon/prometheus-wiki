using System.ComponentModel.DataAnnotations;

namespace PrometheusWiki.API.DTOs.Requests;

public class UpdateWikiPageRequest
{
    [Required] public string Content { get; set; } = string.Empty;
}
