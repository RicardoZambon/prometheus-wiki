using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrometheusWiki.Core.Entities;

namespace PrometheusWiki.Infrastructure.Data.Configurations;

public class WikiPageVersionConfiguration : IEntityTypeConfiguration<WikiPageVersion>
{
    public void Configure(EntityTypeBuilder<WikiPageVersion> builder)
    {
        builder.ToTable("wiki_page_versions");

        builder.HasKey(v => v.Id);
        builder.Property(v => v.Content).HasColumnType("text").IsRequired();

        builder.HasOne(v => v.WikiPage)
            .WithMany(w => w.Versions)
            .HasForeignKey(v => v.WikiPageId);

        builder.HasOne(v => v.ChangedBy)
            .WithMany()
            .HasForeignKey(v => v.ChangedById)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(v => new { v.WikiPageId, v.VersionNumber }).IsUnique();

        builder.HasIndex(v => v.Content)
            .HasAnnotation("MySql:FullTextIndex", true);
    }
}
