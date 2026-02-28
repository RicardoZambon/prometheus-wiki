using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrometheusWiki.Core.Entities;

namespace PrometheusWiki.Infrastructure.Data.Configurations;

public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("user_roles");

        builder.HasKey(ur => new { ur.UserId, ur.RoleId });

        builder.HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId);

        builder.HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId);

        // Assign all roles to the default admin user
        builder.HasData(
            new UserRole { UserId = 1, RoleId = 1 }, // User
            new UserRole { UserId = 1, RoleId = 2 }, // WikiEditor
            new UserRole { UserId = 1, RoleId = 3 }  // Admin
        );
    }
}
