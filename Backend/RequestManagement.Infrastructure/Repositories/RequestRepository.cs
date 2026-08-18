using Microsoft.EntityFrameworkCore;
using RequestManagement.Application.Interfaces;
using RequestManagement.Domain.Entities;
using RequestManagement.Domain.Enums;
using RequestManagement.Infrastructure.Data;

namespace RequestManagement.Infrastructure.Repositories;

public class RequestRepository(AppDbContext context) : IRequestRepository
{
    public async Task<List<Request>> GetAllAsync()
    {
        return await context.Requests
            .Include(r => r.CreatedByUser)
            .Include(r => r.AssignedToUser)
            .OrderByDescending(r => r.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<Request>> GetByUserIdAsync(Guid userId)
    {
        return await context.Requests
            .Include(r => r.CreatedByUser)
            .Include(r => r.AssignedToUser)
            .Where(r => r.CreatedByUserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Request?> GetByIdAsync(Guid id)
    {
        return await context.Requests
            .Include(r => r.CreatedByUser)
            .Include(r => r.AssignedToUser)
            .Include(r => r.Comments)
                .ThenInclude(c => c.User)
            .Include(r => r.RequestHistories)
                .ThenInclude(h => h.User)
            .AsSplitQuery()
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task AddAsync(Request request)
    {
        context.Requests.Add(request);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Request request)
    {
        context.Requests.Update(request);
        await context.SaveChangesAsync();
    }

    public async Task AddHistoryAsync(RequestHistory history)
    {
        context.RequestHistories.Add(history);
        await context.SaveChangesAsync();
    }

    public async Task AddCommentAsync(RequestComment comment)
    {
        context.Comments.Add(comment);
        await context.SaveChangesAsync();
    }

    public async Task<int> GetCountAsync(RequestStatus? status = null)
    {
        if (status.HasValue)
        {
            return await context.Requests.CountAsync(r => r.Status == status.Value);
        }
        return await context.Requests.CountAsync();
    }
}