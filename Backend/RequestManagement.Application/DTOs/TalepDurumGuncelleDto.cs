namespace RequestManagement.Application.DTOs;

using RequestManagement.Domain.Enums;

public record TalepDurumGuncelleDto(
    Guid TalepId,
    TalepDurumu YeniDurum,
    Guid? AtananKullaniciId,
    string? Aciklama
);