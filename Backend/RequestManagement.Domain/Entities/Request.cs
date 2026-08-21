using RequestManagement.Domain.Enums;

namespace RequestManagement.Domain.Entities;

public class Request
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Title { get; set; } = string.Empty;
    public required string Description { get; set; } = string.Empty;
    public RequestType Type { get; set; } = RequestType.Other;
    public RequestPriority Priority { get; set; } = RequestPriority.Medium;
    public RequestStatus Status { get; set; } = RequestStatus.New;

    public Guid CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; } = null!;

    public Guid? AssignedToUserId { get; set; }
    public User? AssignedToUser { get; set; }

    public Guid? DepartmentId { get; set; }
    public Department? Department { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<RequestComment> Comments { get; private set; } = [];
    public ICollection<RequestHistory> RequestHistories { get; private set; } = [];
}