using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrometheusWiki.Core.Entities;

namespace PrometheusWiki.Infrastructure.Data.Configurations;

public class AnswerConfiguration : IEntityTypeConfiguration<Answer>
{
    public void Configure(EntityTypeBuilder<Answer> builder)
    {
        builder.ToTable("answers");

        builder.HasKey(a => a.Id);
        builder.Property(a => a.Content).HasColumnType("text").IsRequired();
        builder.Property(a => a.AiProvider).HasMaxLength(50);
        builder.Property(a => a.UpvoteCount).HasDefaultValue(0);

        builder.HasOne(a => a.Topic)
            .WithMany(t => t.Answers)
            .HasForeignKey(a => a.TopicId);

        builder.HasOne(a => a.User)
            .WithMany(u => u.Answers)
            .HasForeignKey(a => a.UserId);

        builder.HasIndex(a => a.Content)
            .HasAnnotation("MySql:FullTextIndex", true);
    }
}
