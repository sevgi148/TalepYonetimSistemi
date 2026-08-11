using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RequestManagement.Application.DTOs;
using RequestManagement.Application.Interfaces;

namespace RequestManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TaleplerController(ITalepService talepService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> TalepleriGetir()
    {
        var kullaniciIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                             ?? User.FindFirst("sub")?.Value;

        if (!Guid.TryParse(kullaniciIdStr, out var kullaniciGuid))
        {
            return Unauthorized("Kullanıcı oturum bilgisi doğrulanamadı.");
        }

        var talepler = await talepService.KullaniciTalepleriniGetirAsync(kullaniciGuid);
        return Ok(talepler);
    }

    [HttpGet("tum-talepler")]
    public async Task<IActionResult> TumTalepleriGetir()
    {
        var talepler = await talepService.TumTalepleriGetirAsync();
        return Ok(talepler);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> TalepGetirById(Guid id)
    {
        var talep = await talepService.TalepGetirByIdAsync(id);
        if (talep == null)
        {
            return NotFound("Talep bulunamadı.");
        }

        return Ok(talep);
    }

    [HttpPost]
    public async Task<IActionResult> TalepOlustur([FromBody] TalepOlusturDto dto)
    {
        var kullaniciIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                             ?? User.FindFirst("sub")?.Value;

        if (Guid.TryParse(kullaniciIdStr, out var kullaniciGuid))
        {
            dto = dto with { OlusturanKullaniciId = kullaniciGuid };
        }

        var talep = await talepService.TalepOlusturAsync(dto);
        return CreatedAtAction(nameof(TalepGetirById), new { id = talep.Id }, talep);
    }

    [HttpPut("durum")]
    public async Task<IActionResult> DurumGuncelle([FromBody] TalepDurumGuncelleDto dto)
    {
        var basarili = await talepService.DurumGuncelleAsync(dto);
        if (!basarili)
        {
            return NotFound("Güncellenmek istenen talep bulunamadı.");
        }

        return Ok(new { mesaj = "Talep durumu başarıyla güncellendi." });
    }

    [HttpPost("yorum")]
    public async Task<IActionResult> YorumEkle([FromBody] YorumEkleDto dto)
    {
        var kullaniciIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                             ?? User.FindFirst("sub")?.Value;

        if (Guid.TryParse(kullaniciIdStr, out var kullaniciGuid))
        {
            dto = dto with { KullaniciId = kullaniciGuid };
        }

        var basarili = await talepService.YorumEkleAsync(dto);
        if (!basarili)
        {
            return NotFound("Yorum eklenmek istenen talep bulunamadı.");
        }

        return Ok(new { mesaj = "Yorum başarıyla eklendi." });
    }
}