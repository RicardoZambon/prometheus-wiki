using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrometheusWiki.Core.Entities;
using PrometheusWiki.Core.Enums;

namespace PrometheusWiki.Infrastructure.Data.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("notifications");

        builder.HasKey(n => n.Id);
        builder.Property(n => n.Type).HasConversion<string>().HasMaxLength(30);
        builder.Property(n => n.ReferenceType).HasMaxLength(50);
        builder.Property(n => n.Message).HasMaxLength(500).IsRequired();

        builder.HasOne(n => n.User)
            .WithMany(u => u.Notifications)
            .HasForeignKey(n => n.UserId);

        builder.HasIndex(n => new { n.UserId, n.IsRead });
    }
}
