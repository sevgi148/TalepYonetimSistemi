using RequestManagement.Application.DTOs;
using RequestManagement.Application.Interfaces;
using RequestManagement.Domain.Entities;

namespace RequestManagement.Application.Services;

public class IdentityService(
    IUserRepository userRepository,
    ITokenService tokenService) : IIdentityService
{
    public async Task<IdentityResponseDto?> RegisterAsync(UserRegisterDto dto)
    {
        if (await userRepository.EmailExistsAsync(dto.Email))
            return null;

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "User"
        };

        await userRepository.AddAsync(user);

        var token = tokenService.GenerateToken(user);
        return new IdentityResponseDto(user.Id, user.FullName, user.Email, user.Role, token);
    }

    public async Task<IdentityResponseDto?> LoginAsync(UserLoginDto dto)
    {
        var user = await userRepository.GetByEmailAsync(dto.Email);
        if (user == null) return null;

        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
        if (!isPasswordValid) return null;

        var token = tokenService.GenerateToken(user);
        return new IdentityResponseDto(user.Id, user.FullName, user.Email, user.Role, token);
    }
}