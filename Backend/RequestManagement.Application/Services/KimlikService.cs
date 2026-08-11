using RequestManagement.Application.DTOs;
using RequestManagement.Application.Interfaces;
using RequestManagement.Domain.Entities;

namespace RequestManagement.Application.Services;

public class KimlikService(
    IKullaniciRepository kullaniciRepository,
    ITokenService tokenService) : IKimlikService
{
    public async Task<KimlikYanitDto?> KayitOlAsync(KullaniciKayitDto dto)
    {
        if (await kullaniciRepository.EpostaVarMiAsync(dto.Eposta))
            return null;

        var kullanici = new Kullanici
        {
            Eposta = dto.Eposta,
            SifreHash = BCrypt.Net.BCrypt.HashPassword(dto.Sifre),
            Rol = "Kullanici"
        };

        await kullaniciRepository.EkleAsync(kullanici);

        var token = tokenService.TokenOlustur(kullanici);
        return new KimlikYanitDto(kullanici.Id, kullanici.Eposta, kullanici.Rol, token);
    }

    public async Task<KimlikYanitDto?> GirisYapAsync(KullaniciGirisDto dto)
    {
        var kullanici = await kullaniciRepository.EpostaIleGetirAsync(dto.Eposta);
        if (kullanici == null) return null;

        bool sifreDogruMu = BCrypt.Net.BCrypt.Verify(dto.Sifre, kullanici.SifreHash);
        if (!sifreDogruMu) return null;

        var token = tokenService.TokenOlustur(kullanici);
        return new KimlikYanitDto(kullanici.Id, kullanici.Eposta, kullanici.Rol, token);
    }
}