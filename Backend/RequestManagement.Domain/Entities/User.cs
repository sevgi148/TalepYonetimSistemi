namespace RequestManagement.Domain.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public required string FullName { get; set; } = string.Empty;
    public required string Email { get; set; } = string.Empty;
    public required string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "User";

    public ICollection<Request> CreatedRequests { get; private set; } = [];
    public ICollection<Request> AssignedRequests { get; private set; } = [];
    public ICollection<RequestComment> Comments { get; private set; } = [];
    public ICollection<RequestHistory> RequestHistories { get; private set; } = [];
}