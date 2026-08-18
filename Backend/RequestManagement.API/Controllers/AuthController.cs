using Microsoft.AspNetCore.Mvc;
using RequestManagement.Application.DTOs;
using RequestManagement.Application.Interfaces;

namespace RequestManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IIdentityService identityService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
    {
        var result = await identityService.RegisterAsync(dto);
        if (result == null) 
            return BadRequest(new { message = "Bu e-posta adresi zaten kullanımda." });

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
    {
        var result = await identityService.LoginAsync(dto);
        if (result == null) 
            return BadRequest(new { message = "E-posta adresi veya şifre hatalı." });

        return Ok(result);
    }
}