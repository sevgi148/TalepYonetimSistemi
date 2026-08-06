using Microsoft.EntityFrameworkCore;
using RequestManagement.API.Models;

namespace RequestManagement.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Kullanici> Kullanicilar { get; set; }
    public DbSet<Talep> Talepler { get; set; }
    public DbSet<TalepYorum> TalepYorumlari { get; set; }
    public DbSet<TalepGecmisi> TalepGecmisleri { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Talep>()
            .HasOne(t => t.OlusturanKullanici)
            .WithMany()
            .HasForeignKey(t => t.OlusturanKullaniciId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Talep>()
            .HasOne(t => t.AtananKullanici)
            .WithMany()
            .HasForeignKey(t => t.AtananKullaniciId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Talep>()
            .Property(t => t.Oncelik)
            .HasConversion<string>();

        modelBuilder.Entity<Talep>()
            .Property(t => t.Durum)
            .HasConversion<string>();
    }
}