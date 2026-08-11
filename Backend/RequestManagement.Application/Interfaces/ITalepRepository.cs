using RequestManagement.Domain.Entities;
using RequestManagement.Domain.Enums;

namespace RequestManagement.Application.Interfaces;

public interface ITalepRepository
{
    Task<List<Talep>> TumunuGetirAsync();
    Task<Talep?> IdIleGetirAsync(Guid id);
    Task EkleAsync(Talep talep);
    Task GuncelleAsync(Talep talep);
    Task GecmisEkleAsync(TalepGecmisi gecmis);
    Task YorumEkleAsync(TalepYorum yorum);
    Task<int> SayiGetirAsync(TalepDurumu? durum = null);
}