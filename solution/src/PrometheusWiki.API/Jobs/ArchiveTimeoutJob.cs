using PrometheusWiki.Core.Interfaces.Services;

namespace PrometheusWiki.API.Jobs;

public class ArchiveTimeoutJob
{
    private readonly ITopicService _topicService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ArchiveTimeoutJob> _logger;

    public ArchiveTimeoutJob(ITopicService topicService, IConfiguration configuration, ILogger<ArchiveTimeoutJob> logger)
    {
        _topicService = topicService;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task ExecuteAsync()
    {
        var timeoutDays = int.Parse(_configuration["AppSettings:ArchiveTimeoutDays"] ?? "30");
        _logger.LogInformation("Running archive timeout job with {TimeoutDays} day threshold", timeoutDays);
        await _topicService.ArchiveStaleTopicsAsync(timeoutDays);
    }
}
