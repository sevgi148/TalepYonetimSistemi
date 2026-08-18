namespace RequestManagement.Application.DTOs;

public record DashboardSummaryDto(
    int TotalRequests,
    int NewRequests,
    int AssignedRequests,
    int InProgressRequests,
    int CompletedRequests,
    int CancelledRequests
);