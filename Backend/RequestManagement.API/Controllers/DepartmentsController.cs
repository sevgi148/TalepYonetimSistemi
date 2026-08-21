using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RequestManagement.Application.DTOs;
using RequestManagement.Application.Interfaces;

namespace RequestManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous] 
public class DepartmentsController(IAppDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<DepartmentDto>>> GetAll()
    {
        var departments = await context.Departments
            .Where(d => d.IsActive)
            .OrderBy(d => d.Name)
            .Select(d => new DepartmentDto(d.Id, d.Name, d.Description))
            .ToListAsync();

        return Ok(departments);
    }
}