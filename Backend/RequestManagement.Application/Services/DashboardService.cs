using RequestManagement.Application.DTOs;
using RequestManagement.Application.Interfaces;
using RequestManagement.Domain.Enums;

namespace RequestManagement.Application.Services;

public class DashboardService(IRequestRepository requestRepository) : IDashboardService
{
    public async Task<DashboardSummaryDto> GetSummaryAsync(Guid? userId = null)
    {
        var total = await requestRepository.GetCountAsync();
        var newCount = await requestRepository.GetCountAsync(RequestStatus.New);
        var assigned = await requestRepository.GetCountAsync(RequestStatus.Assigned);
        var inProgress = await requestRepository.GetCountAsync(RequestStatus.InProgress);
        var resolved = await requestRepository.GetCountAsync(RequestStatus.Resolved);
        var closed = await requestRepository.GetCountAsync(RequestStatus.Closed);

        var openRequests = newCount + assigned + inProgress;

        var assignedToUser = userId.HasValue && userId.Value != Guid.Empty
            ? await requestRepository.GetAssignedToUserCountAsync(userId.Value)
            : 0;

        var requestsByType = await requestRepository.GetCountByTypeAsync();

        return new DashboardSummaryDto(
            TotalRequests: total,
            NewRequests: newCount,
            AssignedRequests: assigned,
            InProgressRequests: inProgress,
            CompletedRequests: resolved,
            CancelledRequests: closed,
            OpenRequests: openRequests,
            AssignedToUserRequests: assignedToUser,
            RequestsByType: requestsByType
        );
    }
}