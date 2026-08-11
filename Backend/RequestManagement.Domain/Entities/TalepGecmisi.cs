using RequestManagement.Domain.Enums;

namespace RequestManagement.Domain.Entities;

public class TalepGecmisi
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid TalepId { get; set; }
    public Talep Talep { get; set; } = null!;

    public Guid KullaniciId { get; set; }
    public Kullanici Kullanici { get; set; } = null!;

    public TalepDurumu EskiDurum { get; set; }
    public TalepDurumu YeniDurum { get; set; }
    public string? Aciklama { get; set; }
    public DateTime OlusturulmaTarihi { get; set; } = DateTime.UtcNow;
}