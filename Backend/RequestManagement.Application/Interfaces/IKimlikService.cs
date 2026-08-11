using RequestManagement.Application.DTOs;

namespace RequestManagement.Application.Interfaces;

public interface IKimlikService
{
    Task<KimlikYanitDto?> KayitOlAsync(KullaniciKayitDto dto);
    Task<KimlikYanitDto?> GirisYapAsync(KullaniciGirisDto dto);
}