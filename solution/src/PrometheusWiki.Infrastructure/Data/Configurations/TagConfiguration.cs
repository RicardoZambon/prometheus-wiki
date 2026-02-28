using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrometheusWiki.Core.Entities;

namespace PrometheusWiki.Infrastructure.Data.Configurations;

public class TagConfiguration : IEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> builder)
    {
        builder.ToTable("tags");

        builder.HasKey(t => t.Id);
        builder.Property(t => t.Name).HasMaxLength(50).IsRequired();
        builder.Property(t => t.Slug).HasMaxLength(50).IsRequired();
        builder.HasIndex(t => t.Slug).IsUnique();
    }
}
