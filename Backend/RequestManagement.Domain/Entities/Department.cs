namespace RequestManagement.Domain.Entities;

public class Department
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Request> Requests { get; private set; } = [];
}