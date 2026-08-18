using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RequestManagement.Application.DTOs;
using RequestManagement.Application.Interfaces;

namespace RequestManagement.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RequestsController(IRequestService requestService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetUserRequests()
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized(new { message = "Kullanıcı kimliği doğrulanamadı." });
        }

        var requests = await requestService.GetRequestsByUserIdAsync(userId);
        return Ok(requests);
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllRequests()
    {
        var requests = await requestService.GetAllRequestsAsync();
        return Ok(requests);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetRequestById(Guid id)
    {
        var request = await requestService.GetRequestByIdAsync(id);
        if (request == null)
        {
            return NotFound(new { message = "Talep bulunamadı." });
        }

        return Ok(request);
    }

    [HttpPost]
    public async Task<IActionResult> CreateRequest([FromBody] CreateRequestDto dto)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized(new { message = "Kullanıcı kimliği doğrulanamadı." });
        }

        var updatedDto = dto with { CreatedByUserId = userId };
        var request = await requestService.CreateRequestAsync(updatedDto);

        return CreatedAtAction(nameof(GetRequestById), new { id = request.Id }, request);
    }

    [HttpPut("status")]
    public async Task<IActionResult> UpdateStatus([FromBody] UpdateRequestStatusDto dto)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized(new { message = "Kullanıcı kimliği doğrulanamadı." });
        }

        var updatedDto = dto with { AssignedToUserId = dto.AssignedToUserId ?? userId };

        var success = await requestService.UpdateRequestStatusAsync(updatedDto);
        if (!success)
        {
            return NotFound(new { message = "Güncellenecek talep bulunamadı." });
        }

        return Ok(new { message = "Talep durumu başarıyla güncellendi." });
    }

    [HttpPost("comment")]
    public async Task<IActionResult> AddComment([FromBody] AddCommentDto dto)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized(new { message = "Kullanıcı kimliği doğrulanamadı." });
        }

        var updatedDto = dto with { UserId = userId };
        var success = await requestService.AddCommentAsync(updatedDto);

        if (!success)
        {
            return NotFound(new { message = "Yorum eklenecek talep bulunamadı." });
        }

        return Ok(new { message = "Yorum başarıyla eklendi." });
    }

    private bool TryGetUserId(out Guid userId)
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                        ?? User.FindFirst("sub")?.Value;

        return Guid.TryParse(userIdStr, out userId);
    }
}