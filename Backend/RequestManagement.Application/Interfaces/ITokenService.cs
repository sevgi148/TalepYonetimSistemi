using RequestManagement.Domain.Entities;

namespace RequestManagement.Application.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
}