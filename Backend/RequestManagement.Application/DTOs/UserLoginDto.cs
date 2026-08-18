namespace RequestManagement.Application.DTOs;

public record UserLoginDto(
    string Email,
    string Password
);