using PrometheusWiki.Core.Entities;

namespace PrometheusWiki.Core.Interfaces.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetAllAsync(int page, int pageSize);
    Task<User> CreateAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(int id);
    Task<IEnumerable<Role>> GetRolesAsync(int userId);
    Task AssignRoleAsync(int userId, int roleId);
    Task RemoveRoleAsync(int userId, int roleId);
}
