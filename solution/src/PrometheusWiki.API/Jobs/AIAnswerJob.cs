using PrometheusWiki.API.AI;
using PrometheusWiki.Core.Interfaces.Repositories;
using PrometheusWiki.Core.Interfaces.Services;

namespace PrometheusWiki.API.Jobs;

public class AIAnswerJob
{
    private readonly ITopicRepository _topicRepository;
    private readonly IAnswerRepository _answerRepository;
    private readonly AIProviderFactory _aiProviderFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AIAnswerJob> _logger;

    public AIAnswerJob(
        ITopicRepository topicRepository,
        IAnswerRepository answerRepository,
        AIProviderFactory aiProviderFactory,
        IConfiguration configuration,
        ILogger<AIAnswerJob> logger)
    {
        _topicRepository = topicRepository;
        _answerRepository = answerRepository;
        _aiProviderFactory = aiProviderFactory;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task ExecuteAsync()
    {
        var aiEnabled = bool.Parse(_configuration["AIProvider:Enabled"] ?? "false");
        if (!aiEnabled)
        {
            _logger.LogDebug("AI answer generation is disabled");
            return;
        }

        var delayHours = int.Parse(_configuration["AIProvider:TriggerDelayHours"] ?? "24");
        _logger.LogInformation("Running AI answer job with {DelayHours} hour delay", delayHours);

        // TODO: Query for unanswered topics older than delay, generate AI answers
        _logger.LogWarning("AI answer generation not yet implemented");
        await Task.CompletedTask;
    }
}
