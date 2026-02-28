using PrometheusWiki.Core.Interfaces.Services;

namespace PrometheusWiki.API.AI;

public class OpenAIProvider : IAIProvider
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<OpenAIProvider> _logger;

    public OpenAIProvider(IConfiguration configuration, ILogger<OpenAIProvider> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public Task<string> GenerateAnswerAsync(AIAnswerRequest request)
    {
        // TODO: Implement OpenAI API call
        _logger.LogWarning("OpenAIProvider.GenerateAnswerAsync is not yet implemented");
        throw new NotImplementedException("OpenAI provider not yet implemented");
    }

    public Task<string> TranslateAsync(string content, string targetLanguage)
    {
        // TODO: Implement OpenAI API call for translation
        _logger.LogWarning("OpenAIProvider.TranslateAsync is not yet implemented");
        throw new NotImplementedException("OpenAI provider not yet implemented");
    }
}
