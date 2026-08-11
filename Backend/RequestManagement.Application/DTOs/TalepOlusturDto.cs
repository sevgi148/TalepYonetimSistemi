using RequestManagement.Domain.Enums;

namespace RequestManagement.Application.DTOs;

public record TalepOlusturDto(
    string Baslik,
    string Aciklama,
    string TalepTuru,
    OncelikSeviyesi Oncelik,
    Guid OlusturanKullaniciId
);