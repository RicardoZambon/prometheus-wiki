using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrometheusWiki.Core.Interfaces.Repositories;
using PrometheusWiki.Infrastructure.Data;

namespace PrometheusWiki.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly AppDbContext _context;

    public AdminController(IUserRepository userRepository, AppDbContext context)
    {
        _userRepository = userRepository;
        _context = context;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var users = await _userRepository.GetAllAsync(page, pageSize);
        return Ok(users.Select(u => new
        {
            u.Id,
            u.Username,
            u.Email,
            u.IsActive,
            u.LanguagePreference,
            Roles = u.UserRoles.Select(ur => ur.Role.Name),
            u.CreatedAt,
            u.LastLoginAt
        }));
    }

    [HttpPost("users/{userId}/roles/{roleId}")]
    public async Task<IActionResult> AssignRole(int userId, int roleId)
    {
        await _userRepository.AssignRoleAsync(userId, roleId);
        return NoContent();
    }

    [HttpDelete("users/{userId}/roles/{roleId}")]
    public async Task<IActionResult> RemoveRole(int userId, int roleId)
    {
        await _userRepository.RemoveRoleAsync(userId, roleId);
        return NoContent();
    }

    [HttpGet("settings")]
    public async Task<IActionResult> GetSettings()
    {
        var settings = await _context.AppSettings.ToListAsync();
        return Ok(settings);
    }

    [HttpPut("settings/{key}")]
    public async Task<IActionResult> UpdateSetting(string key, [FromBody] string value)
    {
        var setting = await _context.AppSettings.FindAsync(key);
        if (setting == null) return NotFound();

        setting.Value = value;
        setting.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
