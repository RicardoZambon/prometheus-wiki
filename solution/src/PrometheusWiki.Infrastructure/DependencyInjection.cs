using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PrometheusWiki.Core.Interfaces.Repositories;
using PrometheusWiki.Infrastructure.Data;
using PrometheusWiki.Infrastructure.Repositories;

namespace PrometheusWiki.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<AppDbContext>(options =>
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

        services.AddScoped<ITopicRepository, TopicRepository>();
        services.AddScoped<IAnswerRepository, AnswerRepository>();
        services.AddScoped<IWikiPageRepository, WikiPageRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();

        return services;
    }
}
