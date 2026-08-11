using RequestManagement.Application.DTOs;

namespace RequestManagement.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardOzetDto> OzetGetirAsync(string? kullaniciId = null);
}