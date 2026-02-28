using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrometheusWiki.Core.Entities;

namespace PrometheusWiki.Infrastructure.Data.Configurations;

public class TopicTagConfiguration : IEntityTypeConfiguration<TopicTag>
{
    public void Configure(EntityTypeBuilder<TopicTag> builder)
    {
        builder.ToTable("topic_tags");

        builder.HasKey(tt => new { tt.TopicId, tt.TagId });

        builder.HasOne(tt => tt.Topic)
            .WithMany(t => t.TopicTags)
            .HasForeignKey(tt => tt.TopicId);

        builder.HasOne(tt => tt.Tag)
            .WithMany(t => t.TopicTags)
            .HasForeignKey(tt => tt.TagId);
    }
}
