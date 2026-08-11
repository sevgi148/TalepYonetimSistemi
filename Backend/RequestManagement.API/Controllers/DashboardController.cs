using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RequestManagement.Application.Interfaces;

namespace RequestManagement.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    [HttpGet("ozet")]
    public async Task<IActionResult> OzetGetir()
    {
        var ozet = await dashboardService.OzetGetirAsync();
        return Ok(ozet);
    }
}