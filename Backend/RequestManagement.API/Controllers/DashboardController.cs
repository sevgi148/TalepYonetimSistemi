using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RequestManagement.Application.Interfaces;

namespace RequestManagement.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary([FromQuery] Guid? userId = null)
    {
        if (!userId.HasValue || userId.Value == Guid.Empty)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userIdClaim) && Guid.TryParse(userIdClaim, out var parsedId))
            {
                userId = parsedId;
            }
        }

        var summary = await dashboardService.GetSummaryAsync(userId);
        return Ok(summary);
    }
}