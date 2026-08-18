using RequestManagement.Domain.Enums;

namespace RequestManagement.Application.DTOs;

public record CreateRequestDto(
    string Title,
    string Description,
    RequestPriority Priority,
    Guid CreatedByUserId = default
);