using Microsoft.EntityFrameworkCore;
using RequestManagement.Application.Interfaces;
using RequestManagement.Domain.Entities;

namespace RequestManagement.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options), IAppDbContext
{
    public DbSet<Kullanici> Kullanicilar => Set<Kullanici>();
    public DbSet<Talep> Talepler => Set<Talep>();
    public DbSet<TalepYorum> Yorumlar => Set<TalepYorum>();
    public DbSet<TalepGecmisi> TalepGecmisleri => Set<TalepGecmisi>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Talep>()
            .HasOne(t => t.OlusturanKullanici)
            .WithMany(k => k.OlusturulanTalepler)
            .HasForeignKey(t => t.OlusturanKullaniciId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Talep>()
            .HasOne(t => t.AtananKullanici)
            .WithMany(k => k.AtananTalepler)
            .HasForeignKey(t => t.AtananKullaniciId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TalepYorum>()
            .HasOne(y => y.Kullanici)
            .WithMany()
            .HasForeignKey(y => y.KullaniciId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TalepGecmisi>()
            .HasOne(g => g.Kullanici)
            .WithMany()
            .HasForeignKey(g => g.KullaniciId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}