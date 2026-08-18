using RequestManagement.Domain.Enums;

namespace RequestManagement.Application.DTOs;

public record UpdateRequestStatusDto(
    Guid RequestId,
    RequestStatus NewStatus,
    Guid? AssignedToUserId = null,
    string? Description = null
);