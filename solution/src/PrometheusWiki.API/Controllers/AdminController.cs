using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PrometheusWiki.API.DTOs.Requests;
using PrometheusWiki.API.Services;
using PrometheusWiki.Core.Entities;
using PrometheusWiki.Core.Interfaces.Repositories;
using PrometheusWiki.Infrastructure.Data;

namespace PrometheusWiki.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly AppDbContext _context;
    private readonly AuthService _authService;

    private const int AdminRoleId = 3;

    public AdminController(IUserRepository userRepository, AppDbContext context, AuthService authService)
    {
        _userRepository = userRepository;
        _context = context;
        _authService = authService;
    }

    private bool IsAdmin() => User.IsInRole("Admin");
    private bool IsUserManager() => User.IsInRole("UserManager");

    // --- User management: Admin or UserManager ---

    [HttpGet("users")]
    [Authorize(Roles = "Admin,UserManager")]
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

    [HttpPost("users")]
    [Authorize(Roles = "Admin,UserManager")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        if (await _userRepository.GetByUsernameAsync(request.Username) != null)
            return Conflict(new { message = "Username already exists" });

        if (await _userRepository.GetByEmailAsync(request.Email) != null)
            return Conflict(new { message = "Email already exists" });

        // UserManagers cannot assign the Admin role
        if (!IsAdmin() && request.RoleIds.Contains(AdminRoleId))
            return Forbid();

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = _authService.HashPassword(request.Password),
            LanguagePreference = request.LanguagePreference
        };

        await _userRepository.CreateAsync(user);

        // Always assign the base User role
        await _userRepository.AssignRoleAsync(user.Id, 1);

        // Assign additional requested roles
        foreach (var roleId in request.RoleIds.Where(r => r != 1))
        {
            await _userRepository.AssignRoleAsync(user.Id, roleId);
        }

        var createdUser = await _userRepository.GetByIdAsync(user.Id);
        return CreatedAtAction(nameof(GetUsers), new
        {
            createdUser!.Id,
            createdUser.Username,
            createdUser.Email,
            createdUser.IsActive,
            createdUser.LanguagePreference,
            Roles = createdUser.UserRoles.Select(ur => ur.Role.Name),
            createdUser.CreatedAt,
            createdUser.LastLoginAt
        });
    }

    [HttpPost("users/{userId}/roles/{roleId}")]
    [Authorize(Roles = "Admin,UserManager")]
    public async Task<IActionResult> AssignRole(int userId, int roleId)
    {
        // Only admins can assign the Admin role
        if (roleId == AdminRoleId && !IsAdmin())
            return Forbid();

        await _userRepository.AssignRoleAsync(userId, roleId);
        return NoContent();
    }

    [HttpDelete("users/{userId}/roles/{roleId}")]
    [Authorize(Roles = "Admin,UserManager")]
    public async Task<IActionResult> RemoveRole(int userId, int roleId)
    {
        // Only admins can remove the Admin role
        if (roleId == AdminRoleId && !IsAdmin())
            return Forbid();

        await _userRepository.RemoveRoleAsync(userId, roleId);
        return NoContent();
    }

    // --- Settings: Admin only ---

    [HttpGet("settings")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetSettings()
    {
        var settings = await _context.AppSettings.ToListAsync();
        return Ok(settings);
    }

    [HttpPut("settings/{key}")]
    [Authorize(Roles = "Admin")]
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
