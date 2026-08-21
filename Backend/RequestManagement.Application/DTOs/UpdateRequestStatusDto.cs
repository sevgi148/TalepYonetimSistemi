using RequestManagement.Domain.Enums;

namespace RequestManagement.Application.DTOs;

public record UpdateRequestStatusDto(
    Guid RequestId,
    RequestStatus? NewStatus = null,
    Guid? AssignedToUserId = null,
    Guid? DepartmentId = null,
    string? Description = null
);