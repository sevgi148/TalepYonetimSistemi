using RequestManagement.Application.DTOs;
using RequestManagement.Application.Interfaces;
using RequestManagement.Domain.Enums;

namespace RequestManagement.Application.Services;

public class DashboardService(ITalepRepository talepRepository) : IDashboardService
{
    public async Task<DashboardOzetDto> OzetGetirAsync(string? kullaniciId = null)
    {
        var toplam = await talepRepository.SayiGetirAsync();
        var yeni = await talepRepository.SayiGetirAsync(TalepDurumu.Yeni);
        var islemdeki = await talepRepository.SayiGetirAsync(TalepDurumu.Islemde);
        var tamamlanan = await talepRepository.SayiGetirAsync(TalepDurumu.Tamamlandi);
        var iptal = await talepRepository.SayiGetirAsync(TalepDurumu.Iptal);

        return new DashboardOzetDto(toplam, yeni, islemdeki, tamamlanan, iptal);
    }
}