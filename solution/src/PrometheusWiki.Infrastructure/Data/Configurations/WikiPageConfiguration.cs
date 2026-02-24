using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrometheusWiki.Core.Entities;

namespace PrometheusWiki.Infrastructure.Data.Configurations;

public class WikiPageConfiguration : IEntityTypeConfiguration<WikiPage>
{
    public void Configure(EntityTypeBuilder<WikiPage> builder)
    {
        builder.ToTable("wiki_pages");

        builder.HasKey(w => w.Id);
        builder.Property(w => w.Title).HasMaxLength(300).IsRequired();
        builder.Property(w => w.BaseLanguage).HasMaxLength(10).HasDefaultValue("en");

        // Self-referencing for unlimited nesting
        builder.HasOne(w => w.Parent)
            .WithMany(w => w.Children)
            .HasForeignKey(w => w.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(w => w.CreatedBy)
            .WithMany()
            .HasForeignKey(w => w.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(w => w.UpdatedBy)
            .WithMany()
            .HasForeignKey(w => w.UpdatedById)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(w => w.Title)
            .HasAnnotation("MySql:FullTextIndex", true);
    }
}
