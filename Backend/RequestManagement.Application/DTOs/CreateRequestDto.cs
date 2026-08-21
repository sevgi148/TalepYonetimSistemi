using RequestManagement.Domain.Enums;

namespace RequestManagement.Application.DTOs;

public record CreateRequestDto(
    string Title,
    string Description,
    RequestType Type,
    RequestPriority Priority,
    Guid CreatedByUserId = default
);