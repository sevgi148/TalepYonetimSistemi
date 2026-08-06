using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RequestManagement.API.Data;
using RequestManagement.API.DTOs;
using RequestManagement.API.Models;

namespace RequestManagement.API.Controllers;

[Authorize] 
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("ozet")]
    public async Task<IActionResult> OzetGetir()
    {
        var toplam = await _context.Talepler.CountAsync();
        var yeni = await _context.Talepler.CountAsync(t => t.Durum == TalepDurumu.Yeni);
        var islemde = await _context.Talepler.CountAsync(t => t.Durum == TalepDurumu.Islemde || t.Durum == TalepDurumu.Atandi);
        var tamamlanan = await _context.Talepler.CountAsync(t => t.Durum == TalepDurumu.Tamamlandi);
        var iptal = await _context.Talepler.CountAsync(t => t.Durum == TalepDurumu.Iptal);

        var ozet = new DashboardOzetDto
        {
            ToplamTalepSayisi = toplam,
            YeniTalepSayisi = yeni,
            IslemdekiTalepSayisi = islemde,
            TamamlananTalepSayisi = tamamlanan,
            IptalTalepSayisi = iptal
        };

        return Ok(ozet);
    }
}