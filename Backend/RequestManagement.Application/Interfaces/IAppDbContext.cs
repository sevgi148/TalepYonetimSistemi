using Microsoft.EntityFrameworkCore;
using RequestManagement.Domain.Entities;

namespace RequestManagement.Application.Interfaces;

public interface IAppDbContext
{
    DbSet<Talep> Talepler { get; }
    DbSet<Kullanici> Kullanicilar { get; }
    DbSet<TalepGecmisi> TalepGecmisleri { get; }
    DbSet<TalepYorum> Yorumlar { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}