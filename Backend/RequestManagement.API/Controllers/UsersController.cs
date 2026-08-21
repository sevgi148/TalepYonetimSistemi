using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RequestManagement.Application.Interfaces;

namespace RequestManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class UsersController(IAppDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await context.Users
            .OrderBy(u => u.FullName)
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email
            })
            .ToListAsync();

        return Ok(users);
    }
}