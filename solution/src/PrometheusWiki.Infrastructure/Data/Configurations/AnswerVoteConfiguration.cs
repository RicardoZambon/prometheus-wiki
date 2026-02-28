using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PrometheusWiki.Core.Entities;

namespace PrometheusWiki.Infrastructure.Data.Configurations;

public class AnswerVoteConfiguration : IEntityTypeConfiguration<AnswerVote>
{
    public void Configure(EntityTypeBuilder<AnswerVote> builder)
    {
        builder.ToTable("answer_votes");

        builder.HasKey(v => v.Id);

        builder.HasOne(v => v.Answer)
            .WithMany(a => a.Votes)
            .HasForeignKey(v => v.AnswerId);

        builder.HasOne(v => v.User)
            .WithMany(u => u.AnswerVotes)
            .HasForeignKey(v => v.UserId);

        // One vote per user per answer
        builder.HasIndex(v => new { v.AnswerId, v.UserId }).IsUnique();
    }
}
