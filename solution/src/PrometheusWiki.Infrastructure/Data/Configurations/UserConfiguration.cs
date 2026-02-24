using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrometheusWiki.Core.Entities;

namespace PrometheusWiki.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(u => u.Id);
        builder.Property(u => u.Username).HasMaxLength(100).IsRequired();
        builder.Property(u => u.Email).HasMaxLength(255).IsRequired();
        builder.Property(u => u.PasswordHash).HasMaxLength(255).IsRequired();
        builder.Property(u => u.LanguagePreference).HasMaxLength(10).HasDefaultValue("en");

        builder.HasIndex(u => u.Username).IsUnique();
        builder.HasIndex(u => u.Email).IsUnique();

        builder.HasOne(u => u.AiUserContext)
            .WithOne(a => a.User)
            .HasForeignKey<AiUserContext>(a => a.UserId);

        builder.HasData(new User
        {
            Id = 1,
            Username = "admin",
            Email = "admin@prometheus.local",
            PasswordHash = "$2a$11$BKQbyLBpBZEZG1cWjwRZRusbOeRHCYFkT.r11xs/h6Qu1syI8kU4y", // Admin@123
            LanguagePreference = "en",
            CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
            IsActive = true
        });
    }
}
