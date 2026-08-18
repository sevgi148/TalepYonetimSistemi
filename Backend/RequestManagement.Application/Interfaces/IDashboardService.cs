using RequestManagement.Application.DTOs;

namespace RequestManagement.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync(Guid? userId = null);
}