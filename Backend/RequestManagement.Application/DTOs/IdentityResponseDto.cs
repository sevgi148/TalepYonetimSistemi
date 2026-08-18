namespace RequestManagement.Application.DTOs;

public record IdentityResponseDto(
    Guid Id,
    string FullName,
    string Email,
    string Role,
    string Token
);