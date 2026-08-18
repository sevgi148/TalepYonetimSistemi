namespace RequestManagement.Application.DTOs;

public record AddCommentDto(
    Guid RequestId,
    string Content,
    Guid UserId = default
);