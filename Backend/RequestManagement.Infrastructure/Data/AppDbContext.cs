using Microsoft.EntityFrameworkCore;
using RequestManagement.Application.Interfaces;
using RequestManagement.Domain.Entities;

namespace RequestManagement.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options), IAppDbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Request> Requests => Set<Request>();
    public DbSet<RequestComment> Comments => Set<RequestComment>();
    public DbSet<RequestHistory> RequestHistories => Set<RequestHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Request>()
            .HasOne(r => r.CreatedByUser)
            .WithMany(u => u.CreatedRequests)
            .HasForeignKey(r => r.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Request>()
            .HasOne(r => r.AssignedToUser)
            .WithMany(u => u.AssignedRequests)
            .HasForeignKey(r => r.AssignedToUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Request>()
            .HasOne(r => r.Department)
            .WithMany(d => d.Requests)
            .HasForeignKey(r => r.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<RequestComment>()
            .HasOne(c => c.User)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<RequestHistory>()
            .HasOne(h => h.User)
            .WithMany(u => u.RequestHistories)
            .HasForeignKey(h => h.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Department>().HasData(
            new Department
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Name = "Yazılım Destek Ekibi",
                Description = "Yazılım ve sistem geliştirme talepleri",
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Department
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "Donanım & Sistem Yönetimi",
                Description = "Bilgisayar, sunucu ve donanım birimleri",
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Department
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Name = "Ağ ve Güvenlik Birimi",
                Description = "Ağ altyapısı ve siber güvenlik talepleri",
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Department
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Name = "İnsan Kaynakları",
                Description = "Personel, izin ve İK süreçleri",
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Department
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Name = "İdari İşler",
                Description = "Ofis içi genel ihtiyaç ve donatım talepleri",
                IsActive = true,
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}