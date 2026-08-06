using RequestManagement.API.Models;

namespace RequestManagement.API.DTOs;

public class TalepDurumGuncelleDto
{
    public TalepDurumu Durum { get; set; }
    public int? AtananKullaniciId { get; set; }
    public string? Aciklama { get; set; }
}