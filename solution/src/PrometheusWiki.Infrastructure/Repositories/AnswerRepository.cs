using Microsoft.EntityFrameworkCore;
using PrometheusWiki.Core.Entities;
using PrometheusWiki.Core.Interfaces.Repositories;
using PrometheusWiki.Infrastructure.Data;

namespace PrometheusWiki.Infrastructure.Repositories;

public class AnswerRepository : IAnswerRepository
{
    private readonly AppDbContext _context;

    public AnswerRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Answer?> GetByIdAsync(int id)
    {
        return await _context.Answers
            .Include(a => a.User)
            .Include(a => a.Votes)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<Answer>> GetByTopicIdAsync(int topicId)
    {
        return await _context.Answers
            .Include(a => a.User)
            .Include(a => a.Votes)
            .Where(a => a.TopicId == topicId)
            .OrderByDescending(a => a.IsSolution)
            .ThenByDescending(a => a.UpvoteCount)
            .ThenBy(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<Answer> CreateAsync(Answer answer)
    {
        _context.Answers.Add(answer);
        await _context.SaveChangesAsync();
        return answer;
    }

    public async Task UpdateAsync(Answer answer)
    {
        answer.UpdatedAt = DateTime.UtcNow;
        _context.Answers.Update(answer);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var answer = await _context.Answers.FindAsync(id);
        if (answer != null)
        {
            _context.Answers.Remove(answer);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> HasUserVotedAsync(int answerId, int userId)
    {
        return await _context.AnswerVotes
            .AnyAsync(v => v.AnswerId == answerId && v.UserId == userId);
    }

    public async Task AddVoteAsync(AnswerVote vote)
    {
        _context.AnswerVotes.Add(vote);
        var answer = await _context.Answers.FindAsync(vote.AnswerId);
        if (answer != null) answer.UpvoteCount++;
        await _context.SaveChangesAsync();
    }

    public async Task RemoveVoteAsync(int answerId, int userId)
    {
        var vote = await _context.AnswerVotes
            .FirstOrDefaultAsync(v => v.AnswerId == answerId && v.UserId == userId);
        if (vote != null)
        {
            _context.AnswerVotes.Remove(vote);
            var answer = await _context.Answers.FindAsync(answerId);
            if (answer != null && answer.UpvoteCount > 0) answer.UpvoteCount--;
            await _context.SaveChangesAsync();
        }
    }
}
