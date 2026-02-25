using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrometheusWiki.Core.Entities;
using PrometheusWiki.Infrastructure.Data;

namespace PrometheusWiki.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        return Ok(await _context.Categories.OrderBy(c => c.Name).ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        return category == null ? NotFound() : Ok(category);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Category>> CreateCategory([FromBody] Category category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category category)
    {
        if (id != category.Id) return BadRequest();
        _context.Entry(category).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories
            .Include(c => c.Topics)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null) return NotFound();

        if (category.Topics.Count > 0)
            return BadRequest(new { message = "Cannot delete a category that has topics assigned to it." });

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
