namespace PrometheusWiki.Core.Entities;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string LanguagePreference { get; set; } = "en";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<Topic> Topics { get; set; } = new List<Topic>();
    public ICollection<Answer> Answers { get; set; } = new List<Answer>();
    public ICollection<AnswerVote> AnswerVotes { get; set; } = new List<AnswerVote>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public AiUserContext? AiUserContext { get; set; }
}
