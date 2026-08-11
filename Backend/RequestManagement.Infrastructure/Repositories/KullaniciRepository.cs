using Microsoft.EntityFrameworkCore;
using RequestManagement.Application.Interfaces;
using RequestManagement.Domain.Entities;
using RequestManagement.Infrastructure.Data;

namespace RequestManagement.Infrastructure.Repositories;

public class KullaniciRepository(AppDbContext context) : IKullaniciRepository
{
    public async Task<Kullanici?> EpostaIleGetirAsync(string eposta)
    {
        return await context.Kullanicilar
            .AsNoTracking()
            .FirstOrDefaultAsync(k => k.Eposta == eposta);
    }

    public async Task<bool> EpostaVarMiAsync(string eposta)
    {
        return await context.Kullanicilar.AnyAsync(k => k.Eposta == eposta);
    }

    public async Task EkleAsync(Kullanici kullanici)
    {
        context.Kullanicilar.Add(kullanici);
        await context.SaveChangesAsync();
    }
}