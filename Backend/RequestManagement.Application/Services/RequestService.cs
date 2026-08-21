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
            .Include(r => r.Department)
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
            .Include(r => r.Department)
            .OrderByDescending(r => r.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Request?> GetRequestByIdAsync(Guid id)
    {
        return await context.Requests
            .Include(r => r.CreatedByUser)
            .Include(r => r.AssignedToUser)
            .Include(r => r.Department)
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
            Type = dto.Type,
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
            Description = "Talep oluşturuldu."
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

        if (dto.DepartmentId.HasValue)
        {
            request.DepartmentId = dto.DepartmentId.Value != Guid.Empty ? dto.DepartmentId.Value : null;
        }

        if (dto.AssignedToUserId.HasValue)
        {
            request.AssignedToUserId = dto.AssignedToUserId.Value != Guid.Empty ? dto.AssignedToUserId.Value : null;
        }

        if (dto.NewStatus.HasValue)
        {
            request.Status = dto.NewStatus.Value;
        }

        request.UpdatedAt = DateTime.UtcNow;

        context.RequestHistories.Add(new RequestHistory
        {
            RequestId = request.Id,
            UserId = request.CreatedByUserId,
            OldStatus = oldStatus,
            NewStatus = request.Status,
            Description = string.IsNullOrWhiteSpace(dto.Description) 
                ? $"Durum {request.Status} olarak güncellendi." 
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

    public async Task<DashboardSummaryDto> GetSummaryAsync(Guid? userId = null)
    {
        var allRequests = await context.Requests.AsNoTracking().ToListAsync();

        var total = allRequests.Count;
        var newReqs = allRequests.Count(r => r.Status == RequestStatus.New);
        var assigned = allRequests.Count(r => r.Status == RequestStatus.Assigned);
        var inProgress = allRequests.Count(r => r.Status == RequestStatus.InProgress);
        var completed = allRequests.Count(r => r.Status == RequestStatus.Resolved);
        var cancelled = allRequests.Count(r => r.Status == RequestStatus.Closed);

        var openRequests = newReqs + assigned + inProgress;

        var assignedToUser = userId.HasValue && userId.Value != Guid.Empty
            ? allRequests.Count(r => r.AssignedToUserId == userId.Value)
            : 0;

        var requestsByType = allRequests
            .GroupBy(r => r.Type.ToString())
            .ToDictionary(g => g.Key, g => g.Count());

        return new DashboardSummaryDto(
            TotalRequests: total,
            NewRequests: newReqs,
            AssignedRequests: assigned,
            InProgressRequests: inProgress,
            CompletedRequests: completed,
            CancelledRequests: cancelled,
            OpenRequests: openRequests,
            AssignedToUserRequests: assignedToUser,
            RequestsByType: requestsByType
        );
    }
}