namespace RequestManagement.Application.DTOs;

public record UserRegisterDto(
    string FullName,
    string Email,
    string Password
);