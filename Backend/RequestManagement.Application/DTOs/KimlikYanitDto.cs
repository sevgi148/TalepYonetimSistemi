namespace RequestManagement.Application.DTOs;

public record KimlikYanitDto(
    Guid Id,
    string Eposta,
    string Rol,
    string Token
);