using RequestManagement.Domain.Enums;

namespace RequestManagement.Domain.Entities;

public class Talep
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Baslik { get; set; } = string.Empty;
    public string Aciklama { get; set; } = string.Empty;
    public OncelikSeviyesi Oncelik { get; set; } = OncelikSeviyesi.Orta;
    public TalepDurumu Durum { get; set; } = TalepDurumu.Yeni;

    public Guid OlusturanKullaniciId { get; set; }
    public Kullanici OlusturanKullanici { get; set; } = null!;

    public Guid? AtananKullaniciId { get; set; }
    public Kullanici? AtananKullanici { get; set; }

    public DateTime OlusturulmaTarihi { get; set; } = DateTime.UtcNow;
    public DateTime? GuncellenmeTarihi { get; set; }

    public ICollection<TalepYorum> Yorumlar { get; set; } = new List<TalepYorum>();
    public ICollection<TalepGecmisi> TalepGecmisleri { get; set; } = new List<TalepGecmisi>();
}