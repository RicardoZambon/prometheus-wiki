using Microsoft.EntityFrameworkCore;
using PrometheusWiki.Core.Entities;
using PrometheusWiki.Core.Enums;
using PrometheusWiki.Core.Interfaces.Repositories;
using PrometheusWiki.Infrastructure.Data;

namespace PrometheusWiki.Infrastructure.Repositories;

public class TopicRepository : ITopicRepository
{
    private readonly AppDbContext _context;

    public TopicRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Topic?> GetByIdAsync(int id)
    {
        return await _context.Topics
            .Include(t => t.User)
            .Include(t => t.Category)
            .Include(t => t.TopicTags).ThenInclude(tt => tt.Tag)
            .Include(t => t.Answers).ThenInclude(a => a.User)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<IEnumerable<Topic>> GetAllAsync(int page, int pageSize)
    {
        return await _context.Topics
            .Include(t => t.User)
            .Include(t => t.Category)
            .Include(t => t.TopicTags).ThenInclude(tt => tt.Tag)
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Topic>> SearchAsync(string query, int? categoryId, TopicStatus? status, int page, int pageSize)
    {
        var queryable = _context.Topics
            .Include(t => t.User)
            .Include(t => t.Category)
            .Include(t => t.TopicTags).ThenInclude(tt => tt.Tag)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query))
        {
            queryable = queryable.Where(t =>
                EF.Functions.Like(t.Title, $"%{query}%") ||
                EF.Functions.Like(t.Content, $"%{query}%"));
        }

        if (categoryId.HasValue)
            queryable = queryable.Where(t => t.CategoryId == categoryId.Value);

        if (status.HasValue)
            queryable = queryable.Where(t => t.Status == status.Value);

        return await queryable
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Topic>> GetByUserIdAsync(int userId)
    {
        return await _context.Topics
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Topic>> GetStaleOpenTopicsAsync(int timeoutDays)
    {
        var cutoff = DateTime.UtcNow.AddDays(-timeoutDays);
        return await _context.Topics
            .Where(t => t.Status == TopicStatus.Open && t.CreatedAt < cutoff && !t.Answers.Any())
            .ToListAsync();
    }

    public async Task<Topic> CreateAsync(Topic topic)
    {
        _context.Topics.Add(topic);
        await _context.SaveChangesAsync();
        return topic;
    }

    public async Task UpdateAsync(Topic topic)
    {
        topic.UpdatedAt = DateTime.UtcNow;
        _context.Topics.Update(topic);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var topic = await _context.Topics.FindAsync(id);
        if (topic != null)
        {
            _context.Topics.Remove(topic);
            await _context.SaveChangesAsync();
        }
    }
}
