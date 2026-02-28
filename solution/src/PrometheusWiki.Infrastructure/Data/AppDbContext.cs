using Microsoft.EntityFrameworkCore;
using PrometheusWiki.Core.Entities;

namespace PrometheusWiki.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<Topic> Topics => Set<Topic>();
    public DbSet<TopicTag> TopicTags => Set<TopicTag>();
    public DbSet<Answer> Answers => Set<Answer>();
    public DbSet<AnswerVote> AnswerVotes => Set<AnswerVote>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<WikiPage> WikiPages => Set<WikiPage>();
    public DbSet<WikiPageVersion> WikiPageVersions => Set<WikiPageVersion>();
    public DbSet<WikiPageTranslation> WikiPageTranslations => Set<WikiPageTranslation>();
    public DbSet<AiUserContext> AiUserContexts => Set<AiUserContext>();
    public DbSet<AppSetting> AppSettings => Set<AppSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
