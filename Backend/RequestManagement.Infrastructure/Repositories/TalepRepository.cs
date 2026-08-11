using Microsoft.EntityFrameworkCore;
using RequestManagement.Application.Interfaces;
using RequestManagement.Domain.Entities;
using RequestManagement.Domain.Enums;
using RequestManagement.Infrastructure.Data;

namespace RequestManagement.Infrastructure.Repositories;

public class TalepRepository(AppDbContext context) : ITalepRepository
{
    public async Task<List<Talep>> TumunuGetirAsync()
    {
        return await context.Talepler
            .Include(t => t.OlusturanKullanici)
            .Include(t => t.AtananKullanici)
            .OrderByDescending(t => t.OlusturulmaTarihi)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Talep?> IdIleGetirAsync(Guid id)
    {
        return await context.Talepler
            .Include(t => t.OlusturanKullanici)
            .Include(t => t.AtananKullanici)
            .Include(t => t.Yorumlar).ThenInclude(y => y.Kullanici)
            .Include(t => t.TalepGecmisleri).ThenInclude(g => g.Kullanici)
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task EkleAsync(Talep talep)
    {
        context.Talepler.Add(talep);
        await context.SaveChangesAsync();
    }

    public async Task GuncelleAsync(Talep talep)
    {
        context.Talepler.Update(talep);
        await context.SaveChangesAsync();
    }

    public async Task GecmisEkleAsync(TalepGecmisi gecmis)
    {
        context.TalepGecmisleri.Add(gecmis);
        await context.SaveChangesAsync();
    }

    public async Task YorumEkleAsync(TalepYorum yorum)
    {
        context.Yorumlar.Add(yorum);
        await context.SaveChangesAsync();
    }

    public async Task<int> SayiGetirAsync(TalepDurumu? durum = null)
    {
        if (durum.HasValue)
        {
            return await context.Talepler.CountAsync(t => t.Durum == durum.Value);
        }
        return await context.Talepler.CountAsync();
    }
}