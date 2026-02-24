using PrometheusWiki.Core.Interfaces.Services;

namespace PrometheusWiki.API.AI;

public class AnthropicProvider : IAIProvider
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<AnthropicProvider> _logger;

    public AnthropicProvider(IConfiguration configuration, ILogger<AnthropicProvider> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public Task<string> GenerateAnswerAsync(AIAnswerRequest request)
    {
        // TODO: Implement Anthropic API call
        _logger.LogWarning("AnthropicProvider.GenerateAnswerAsync is not yet implemented");
        throw new NotImplementedException("Anthropic provider not yet implemented");
    }

    public Task<string> TranslateAsync(string content, string targetLanguage)
    {
        // TODO: Implement Anthropic API call for translation
        _logger.LogWarning("AnthropicProvider.TranslateAsync is not yet implemented");
        throw new NotImplementedException("Anthropic provider not yet implemented");
    }
}
