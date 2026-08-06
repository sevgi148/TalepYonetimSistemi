using System.Security.Claims;
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
public class TaleplerController : ControllerBase
{
    private readonly AppDbContext _context;

    public TaleplerController(AppDbContext context)
    {
        _context = context;
    }

    private int GetAktifKullaniciId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return claim != null ? int.Parse(claim.Value) : 0;
    }

    [HttpGet("ozet")]
    public async Task<IActionResult> OzetGetir()
    {
        var kullaniciId = GetAktifKullaniciId();

        var toplam = await _context.Talepler.CountAsync(t => t.OlusturanKullaniciId == kullaniciId);
        var yeni = await _context.Talepler.CountAsync(t => t.OlusturanKullaniciId == kullaniciId && t.Durum == TalepDurumu.Yeni);
        var islemde = await _context.Talepler.CountAsync(t => t.OlusturanKullaniciId == kullaniciId && t.Durum == TalepDurumu.Islemde);
        var tamamlanan = await _context.Talepler.CountAsync(t => t.OlusturanKullaniciId == kullaniciId && t.Durum == TalepDurumu.Tamamlandi);
        var iptal = await _context.Talepler.CountAsync(t => t.OlusturanKullaniciId == kullaniciId && t.Durum == TalepDurumu.Iptal);

        return Ok(new
        {
            toplam,
            yeni,
            islemde,
            tamamlanan,
            iptal
        });
    }

    [HttpGet]
    public async Task<IActionResult> TalepleriGetir()
    {
        var kullaniciId = GetAktifKullaniciId();

        var talepler = await _context.Talepler
            .Where(t => t.OlusturanKullaniciId == kullaniciId || t.AtananKullaniciId == kullaniciId)
            .Include(t => t.OlusturanKullanici)
            .Include(t => t.AtananKullanici)
            .Include(t => t.Yorumlar)
            .Include(t => t.Gecmis)
            .OrderByDescending(t => t.OlusturulmaTarihi)
            .ToListAsync();

        return Ok(talepler);
    }

    [HttpPost]
    public async Task<IActionResult> TalepOlustur(TalepOlusturDto dto)
    {
        var olusturanId = GetAktifKullaniciId();

        var yeniTalep = new Talep
        {
            Baslik = dto.Baslik,
            Aciklama = dto.Aciklama,
            TalepTuru = dto.TalepTuru,
            Oncelik = dto.Oncelik,
            Durum = TalepDurumu.Yeni,
            OlusturanKullaniciId = olusturanId,
            OlusturulmaTarihi = DateTime.UtcNow
        };

        _context.Talepler.Add(yeniTalep);
        await _context.SaveChangesAsync();

        var gecmis = new TalepGecmisi
        {
            TalepId = yeniTalep.Id,
            IslemYapanKullaniciId = olusturanId,
            EskiDurum = "-",
            YeniDurum = TalepDurumu.Yeni.ToString(),
            Aciklama = "Talep oluşturuldu."
        };
        _context.TalepGecmisleri.Add(gecmis);
        await _context.SaveChangesAsync();

        return Ok(yeniTalep);
    }

    [HttpPut("{id}/durum")]
    public async Task<IActionResult> DurumGuncelle(int id, TalepDurumGuncelleDto dto)
    {
        var islemYapanId = GetAktifKullaniciId();
        var talep = await _context.Talepler.FindAsync(id);
        if (talep == null) return NotFound("Talep bulunamadı.");

        string eskiDurum = talep.Durum.ToString();
        talep.Durum = dto.Durum;
        talep.GuncellenmeTarihi = DateTime.UtcNow;

        if (dto.AtananKullaniciId.HasValue)
        {
            talep.AtananKullaniciId = dto.AtananKullaniciId.Value;
        }

        var gecmis = new TalepGecmisi
        {
            TalepId = talep.Id,
            IslemYapanKullaniciId = islemYapanId,
            EskiDurum = eskiDurum,
            YeniDurum = dto.Durum.ToString(),
            Aciklama = dto.Aciklama ?? $"Durum {dto.Durum} olarak güncellendi."
        };

        _context.TalepGecmisleri.Add(gecmis);
        await _context.SaveChangesAsync();

        return Ok(new { Mesaj = "Talep durumu güncellendi.", Talep = talep });
    }

    [HttpPost("{id}/yorum")]
    public async Task<IActionResult> YorumEkle(int id, YorumEkleDto dto)
    {
        var kullaniciId = GetAktifKullaniciId();
        var talep = await _context.Talepler.FindAsync(id);
        if (talep == null) return NotFound("Talep bulunamadı.");

        var yorum = new TalepYorum
        {
            TalepId = id,
            KullaniciId = kullaniciId,
            Yorum = dto.Yorum,
            OlusturmaTarihi = DateTime.UtcNow
        };

        _context.TalepYorumlari.Add(yorum);
        await _context.SaveChangesAsync();

        return Ok(new { Mesaj = "Yorum eklendi.", Yorum = yorum });
    }

    [HttpGet("{id}/gecmis")]
    public async Task<IActionResult> TalepGecmisiniGetir(int id)
    {
        var gecmis = await _context.TalepGecmisleri
            .Where(g => g.TalepId == id)
            .OrderByDescending(g => g.IslemTarihi)
            .ToListAsync();

        return Ok(gecmis);
    }
}