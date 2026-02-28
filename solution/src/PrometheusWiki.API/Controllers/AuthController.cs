using Microsoft.AspNetCore.Mvc;
using PrometheusWiki.API.DTOs.Requests;
using PrometheusWiki.API.DTOs.Responses;
using PrometheusWiki.API.Services;
using PrometheusWiki.Core.Entities;
using PrometheusWiki.Core.Interfaces.Repositories;

namespace PrometheusWiki.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly AuthService _authService;

    public AuthController(IUserRepository userRepository, AuthService authService)
    {
        _userRepository = userRepository;
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await _userRepository.GetByUsernameAsync(request.Username);
        if (user == null || !_authService.VerifyPassword(request.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid credentials" });

        if (!user.IsActive)
            return Unauthorized(new { message = "Account is deactivated" });

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        var token = _authService.GenerateToken(user, roles);

        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        return Ok(new AuthResponse
        {
            Token = token,
            Username = user.Username,
            Roles = roles,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        });
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        if (await _userRepository.GetByUsernameAsync(request.Username) != null)
            return Conflict(new { message = "Username already exists" });

        if (await _userRepository.GetByEmailAsync(request.Email) != null)
            return Conflict(new { message = "Email already exists" });

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = _authService.HashPassword(request.Password),
            LanguagePreference = request.LanguagePreference
        };

        await _userRepository.CreateAsync(user);
        await _userRepository.AssignRoleAsync(user.Id, 1); // Default "User" role

        var roles = new List<string> { "User" };
        var token = _authService.GenerateToken(user, roles);

        return CreatedAtAction(nameof(Login), new AuthResponse
        {
            Token = token,
            Username = user.Username,
            Roles = roles,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        });
    }
}
