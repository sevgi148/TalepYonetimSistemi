namespace RequestManagement.Application.DTOs;

public record YorumEkleDto(
    Guid TalepId,
    Guid KullaniciId,
    string Yorum
);