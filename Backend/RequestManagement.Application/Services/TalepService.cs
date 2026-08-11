using Microsoft.EntityFrameworkCore;
using RequestManagement.Application.DTOs;
using RequestManagement.Application.Interfaces;
using RequestManagement.Domain.Entities;
using RequestManagement.Domain.Enums;

namespace RequestManagement.Application.Services;

public class TalepService(IAppDbContext context) : ITalepService
{
    public async Task<List<Talep>> KullaniciTalepleriniGetirAsync(Guid kullaniciId)
    {
        return await context.Talepler
            .Include(t => t.OlusturanKullanici)
            .Include(t => t.AtananKullanici)
            .Where(t => t.OlusturanKullaniciId == kullaniciId)
            .OrderByDescending(t => t.OlusturulmaTarihi)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<Talep>> TumTalepleriGetirAsync()
    {
        return await context.Talepler
            .Include(t => t.OlusturanKullanici)
            .Include(t => t.AtananKullanici)
            .OrderByDescending(t => t.OlusturulmaTarihi)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Talep?> TalepGetirByIdAsync(Guid id)
    {
        return await context.Talepler
            .Include(t => t.OlusturanKullanici)
            .Include(t => t.AtananKullanici)
            .Include(t => t.Yorumlar)
                .ThenInclude(y => y.Kullanici)
            .Include(t => t.TalepGecmisleri)
                .ThenInclude(g => g.Kullanici)
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Talep> TalepOlusturAsync(TalepOlusturDto dto)
    {
        var talep = new Talep
        {
            Baslik = dto.Baslik,
            Aciklama = dto.Aciklama,
            Oncelik = dto.Oncelik,
            Durum = TalepDurumu.Yeni,
            OlusturanKullaniciId = dto.OlusturanKullaniciId
        };

        talep.TalepGecmisleri.Add(new TalepGecmisi
        {
            TalepId = talep.Id,
            KullaniciId = dto.OlusturanKullaniciId,
            EskiDurum = TalepDurumu.Yeni,
            YeniDurum = TalepDurumu.Yeni,
            Aciklama = "Talep oluşturuldu."
        });

        context.Talepler.Add(talep);
        await context.SaveChangesAsync();

        return talep;
    }

    public async Task<bool> DurumGuncelleAsync(TalepDurumGuncelleDto dto)
    {
        var talep = await context.Talepler.FirstOrDefaultAsync(t => t.Id == dto.TalepId);
        if (talep == null) return false;

        var eskiDurum = talep.Durum;
        talep.Durum = dto.YeniDurum;
        talep.GuncellenmeTarihi = DateTime.UtcNow;

        if (dto.AtananKullaniciId.HasValue)
        {
            talep.AtananKullaniciId = dto.AtananKullaniciId.Value;
        }

        context.TalepGecmisleri.Add(new TalepGecmisi
        {
            TalepId = talep.Id,
            KullaniciId = dto.AtananKullaniciId ?? talep.OlusturanKullaniciId,
            EskiDurum = eskiDurum,
            YeniDurum = dto.YeniDurum,
            Aciklama = dto.Aciklama ?? $"Durum {eskiDurum} -> {dto.YeniDurum} olarak güncellendi."
        });

        await context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> YorumEkleAsync(YorumEkleDto dto)
    {
        var talepVarMi = await context.Talepler.AnyAsync(t => t.Id == dto.TalepId);
        if (!talepVarMi) return false;

        var yorum = new TalepYorum
        {
            TalepId = dto.TalepId,
            KullaniciId = dto.KullaniciId,
            Yorum = dto.Yorum
        };

        context.Yorumlar.Add(yorum);
        await context.SaveChangesAsync();
        return true;
    }
}