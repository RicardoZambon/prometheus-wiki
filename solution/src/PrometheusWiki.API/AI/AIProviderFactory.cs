using PrometheusWiki.Core.Interfaces.Services;

namespace PrometheusWiki.API.AI;

public class AIProviderFactory
{
    private readonly IConfiguration _configuration;
    private readonly IServiceProvider _serviceProvider;

    public AIProviderFactory(IConfiguration configuration, IServiceProvider serviceProvider)
    {
        _configuration = configuration;
        _serviceProvider = serviceProvider;
    }

    public IAIProvider Create()
    {
        var provider = _configuration["AIProvider:Provider"] ?? "Anthropic";

        return provider switch
        {
            "Anthropic" => _serviceProvider.GetRequiredService<AnthropicProvider>(),
            "OpenAI" => _serviceProvider.GetRequiredService<OpenAIProvider>(),
            _ => throw new InvalidOperationException($"Unknown AI provider: {provider}")
        };
    }
}
