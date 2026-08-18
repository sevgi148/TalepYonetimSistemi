using RequestManagement.Domain.Entities;
using RequestManagement.Domain.Enums;

namespace RequestManagement.Application.Interfaces;

public interface IRequestRepository
{
    Task<List<Request>> GetAllAsync();
    Task<List<Request>> GetByUserIdAsync(Guid userId);
    Task<Request?> GetByIdAsync(Guid id);
    Task AddAsync(Request request);
    Task UpdateAsync(Request request);
    Task AddHistoryAsync(RequestHistory history);
    Task AddCommentAsync(RequestComment comment);
    Task<int> GetCountAsync(RequestStatus? status = null);
}