using RequestManagement.Application.DTOs;

namespace RequestManagement.Application.Interfaces;

public interface IIdentityService
{
    Task<IdentityResponseDto?> RegisterAsync(UserRegisterDto dto);
    Task<IdentityResponseDto?> LoginAsync(UserLoginDto dto);
}