using Microsoft.AspNetCore.Mvc;
using RequestManagement.Application.DTOs;
using RequestManagement.Application.Interfaces;

namespace RequestManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KimlikController(IKimlikService kimlikService) : ControllerBase
{
    [HttpPost("kayit")]
    public async Task<IActionResult> KayitOl([FromBody] KullaniciKayitDto dto)
    {
        var sonuc = await kimlikService.KayitOlAsync(dto);
        if (sonuc == null) return BadRequest("Bu e-posta adresi zaten kullanılıyor.");
        return Ok(sonuc);
    }

    [HttpPost("giris")]
    public async Task<IActionResult> GirisYap([FromBody] KullaniciGirisDto dto)
    {
        var sonuc = await kimlikService.GirisYapAsync(dto);
        if (sonuc == null) return Unauthorized("Geçersiz e-posta veya şifre.");
        return Ok(sonuc);
    }
}