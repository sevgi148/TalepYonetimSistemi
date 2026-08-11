using RequestManagement.Application.DTOs;
using RequestManagement.Domain.Entities;

namespace RequestManagement.Application.Interfaces;

public interface ITalepService
{
    Task<List<Talep>> KullaniciTalepleriniGetirAsync(Guid kullaniciId);
    Task<List<Talep>> TumTalepleriGetirAsync();
    Task<Talep?> TalepGetirByIdAsync(Guid id);
    Task<Talep> TalepOlusturAsync(TalepOlusturDto dto);
    Task<bool> DurumGuncelleAsync(TalepDurumGuncelleDto dto);
    Task<bool> YorumEkleAsync(YorumEkleDto dto);
}