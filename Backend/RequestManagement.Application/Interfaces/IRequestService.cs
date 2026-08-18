using RequestManagement.Application.DTOs;
using RequestManagement.Domain.Entities;

namespace RequestManagement.Application.Interfaces;

public interface IRequestService
{
    Task<List<Request>> GetRequestsByUserIdAsync(Guid userId);
    Task<List<Request>> GetAllRequestsAsync();
    Task<Request?> GetRequestByIdAsync(Guid id);
    Task<Request> CreateRequestAsync(CreateRequestDto dto);
    Task<bool> UpdateRequestStatusAsync(UpdateRequestStatusDto dto);
    Task<bool> AddCommentAsync(AddCommentDto dto);
}