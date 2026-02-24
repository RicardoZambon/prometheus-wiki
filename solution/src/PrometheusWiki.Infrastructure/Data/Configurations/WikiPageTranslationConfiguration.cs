using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrometheusWiki.Core.Entities;

namespace PrometheusWiki.Infrastructure.Data.Configurations;

public class WikiPageTranslationConfiguration : IEntityTypeConfiguration<WikiPageTranslation>
{
    public void Configure(EntityTypeBuilder<WikiPageTranslation> builder)
    {
        builder.ToTable("wiki_page_translations");

        builder.HasKey(t => t.Id);
        builder.Property(t => t.Language).HasMaxLength(10).IsRequired();
        builder.Property(t => t.Content).HasColumnType("text").IsRequired();

        builder.HasOne(t => t.WikiPage)
            .WithMany(w => w.Translations)
            .HasForeignKey(t => t.WikiPageId);

        builder.HasOne(t => t.TranslatedBy)
            .WithMany()
            .HasForeignKey(t => t.TranslatedById)
            .OnDelete(DeleteBehavior.Restrict);

        // One translation per language per page
        builder.HasIndex(t => new { t.WikiPageId, t.Language }).IsUnique();
    }
}
