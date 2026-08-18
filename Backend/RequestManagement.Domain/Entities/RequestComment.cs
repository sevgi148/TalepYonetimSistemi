namespace RequestManagement.Domain.Entities;

public class RequestComment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid RequestId { get; set; }
    public Request Request { get; set; } = null!;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}