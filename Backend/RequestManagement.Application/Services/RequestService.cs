using Microsoft.EntityFrameworkCore;
using RequestManagement.Application.DTOs;
using RequestManagement.Application.Interfaces;
using RequestManagement.Domain.Entities;
using RequestManagement.Domain.Enums;

namespace RequestManagement.Application.Services;

public class RequestService(IAppDbContext context) : IRequestService
{
    public async Task<List<Request>> GetRequestsByUserIdAsync(Guid userId)
    {
        return await context.Requests
            .Include(r => r.CreatedByUser)
            .Include(r => r.AssignedToUser)
            .Where(r => r.CreatedByUserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<Request>> GetAllRequestsAsync()
    {
        return await context.Requests
            .Include(r => r.CreatedByUser)
            .Include(r => r.AssignedToUser)
            .OrderByDescending(r => r.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Request?> GetRequestByIdAsync(Guid id)
    {
        return await context.Requests
            .Include(r => r.CreatedByUser)
            .Include(r => r.AssignedToUser)
            .Include(r => r.Comments)
                .ThenInclude(c => c.User)
            .Include(r => r.RequestHistories)
                .ThenInclude(h => h.User)
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<Request> CreateRequestAsync(CreateRequestDto dto)
    {
        var request = new Request
        {
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority,
            Status = RequestStatus.New,
            CreatedByUserId = dto.CreatedByUserId
        };

        request.RequestHistories.Add(new RequestHistory
        {
            RequestId = request.Id,
            UserId = dto.CreatedByUserId,
            OldStatus = RequestStatus.New,
            NewStatus = RequestStatus.New,
            Description = "Request created."
        });

        context.Requests.Add(request);
        await context.SaveChangesAsync();

        var createdRequest = await GetRequestByIdAsync(request.Id);
        return createdRequest ?? request;
    }

    public async Task<bool> UpdateRequestStatusAsync(UpdateRequestStatusDto dto)
    {
        var request = await context.Requests.FirstOrDefaultAsync(r => r.Id == dto.RequestId);
        if (request == null) return false;

        var oldStatus = request.Status;
        request.Status = dto.NewStatus;
        request.UpdatedAt = DateTime.UtcNow;

        if (dto.AssignedToUserId.HasValue && dto.AssignedToUserId.Value != Guid.Empty)
        {
            request.AssignedToUserId = dto.AssignedToUserId.Value;
        }

        context.RequestHistories.Add(new RequestHistory
        {
            RequestId = request.Id,
            UserId = (dto.AssignedToUserId.HasValue && dto.AssignedToUserId.Value != Guid.Empty)
                ? dto.AssignedToUserId.Value 
                : request.CreatedByUserId,
            OldStatus = oldStatus,
            NewStatus = dto.NewStatus,
            Description = string.IsNullOrWhiteSpace(dto.Description) 
                ? $"Status changed from {oldStatus} to {dto.NewStatus}." 
                : dto.Description
        });

        await context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AddCommentAsync(AddCommentDto dto)
    {
        var requestExists = await context.Requests.AnyAsync(r => r.Id == dto.RequestId);
        if (!requestExists || dto.UserId == Guid.Empty) 
            return false;

        if (string.IsNullOrWhiteSpace(dto.Content))
            return false;

        var comment = new RequestComment
        {
            RequestId = dto.RequestId,
            UserId = dto.UserId,
            Content = dto.Content.Trim()
        };

        context.Comments.Add(comment);
        await context.SaveChangesAsync();
        return true;
    }
}