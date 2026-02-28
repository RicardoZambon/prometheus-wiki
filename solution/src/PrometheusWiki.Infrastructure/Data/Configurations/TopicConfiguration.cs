using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrometheusWiki.Core.Entities;
using PrometheusWiki.Core.Enums;

namespace PrometheusWiki.Infrastructure.Data.Configurations;

public class TopicConfiguration : IEntityTypeConfiguration<Topic>
{
    public void Configure(EntityTypeBuilder<Topic> builder)
    {
        builder.ToTable("topics");

        builder.HasKey(t => t.Id);
        builder.Property(t => t.Title).HasMaxLength(300).IsRequired();
        builder.Property(t => t.Content).HasColumnType("text").IsRequired();
        builder.Property(t => t.Status).HasConversion<string>().HasMaxLength(20).HasDefaultValue(TopicStatus.Open);
        builder.Property(t => t.ViewCount).HasDefaultValue(0);

        builder.HasOne(t => t.User)
            .WithMany(u => u.Topics)
            .HasForeignKey(t => t.UserId);

        builder.HasOne(t => t.Category)
            .WithMany(c => c.Topics)
            .HasForeignKey(t => t.CategoryId);

        builder.HasIndex(t => new { t.Title, t.Content })
            .HasAnnotation("MySql:FullTextIndex", true);
    }
}
