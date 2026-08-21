namespace RequestManagement.Application.DTOs;

public record DepartmentDto(
    Guid Id,
    string Name,
    string? Description
);