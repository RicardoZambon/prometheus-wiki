using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrometheusWiki.Core.Entities;

namespace PrometheusWiki.Infrastructure.Data.Configurations;

public class AiUserContextConfiguration : IEntityTypeConfiguration<AiUserContext>
{
    public void Configure(EntityTypeBuilder<AiUserContext> builder)
    {
        builder.ToTable("ai_user_context");

        builder.HasKey(a => a.Id);
        builder.Property(a => a.ContextSummary).HasColumnType("text");

        builder.HasIndex(a => a.UserId).IsUnique();
    }
}
