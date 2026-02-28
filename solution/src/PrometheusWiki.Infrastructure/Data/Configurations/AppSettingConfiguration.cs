using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrometheusWiki.Core.Entities;

namespace PrometheusWiki.Infrastructure.Data.Configurations;

public class AppSettingConfiguration : IEntityTypeConfiguration<AppSetting>
{
    public void Configure(EntityTypeBuilder<AppSetting> builder)
    {
        builder.ToTable("app_settings");

        builder.HasKey(s => s.Key);
        builder.Property(s => s.Key).HasMaxLength(100);
        builder.Property(s => s.Value).HasMaxLength(1000).IsRequired();
        builder.Property(s => s.Description).HasMaxLength(500);

        builder.HasData(
            new AppSetting { Key = "archive_timeout_days", Value = "30", Description = "Days before an unanswered topic is archived" },
            new AppSetting { Key = "ai_enabled", Value = "false", Description = "Whether AI features are enabled" },
            new AppSetting { Key = "ai_provider", Value = "Anthropic", Description = "AI provider to use (Anthropic, OpenAI)" },
            new AppSetting { Key = "ai_trigger_delay_hours", Value = "24", Description = "Hours to wait before AI generates an answer" }
        );
    }
}
