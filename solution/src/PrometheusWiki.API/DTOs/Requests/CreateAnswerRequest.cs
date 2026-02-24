using System.ComponentModel.DataAnnotations;

namespace PrometheusWiki.API.DTOs.Requests;

public class CreateAnswerRequest
{
    [Required] public string Content { get; set; } = string.Empty;
}
