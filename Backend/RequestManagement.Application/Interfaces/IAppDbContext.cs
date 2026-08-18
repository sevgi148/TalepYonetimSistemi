using Microsoft.EntityFrameworkCore;
using RequestManagement.Domain.Entities;

namespace RequestManagement.Application.Interfaces;

public interface IAppDbContext
{
    DbSet<Request> Requests { get; }
    DbSet<User> Users { get; }
    DbSet<RequestHistory> RequestHistories { get; }
    DbSet<RequestComment> Comments { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}