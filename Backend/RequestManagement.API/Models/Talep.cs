namespace RequestManagement.API.Models;

public enum OncelikSeviyesi
{
    Dusuk,
    Orta,
    Yuksek,
    Acil
}

public enum TalepDurumu
{
    Yeni,
    Atandi,
    Islemde,
    Tamamlandi,
    Iptal
}

public class Talep
{
    public int Id { get; set; }
    public string Baslik { get; set; } = string.Empty;
    public string Aciklama { get; set; } = string.Empty;
    public string TalepTuru { get; set; } = string.Empty; 
    
    public OncelikSeviyesi Oncelik { get; set; } = OncelikSeviyesi.Orta;  //öncelik değeri atanmadığında varsayılan olarak Orta al.
    public TalepDurumu Durum { get; set; } = TalepDurumu.Yeni;   //talep durumu atanmadığında varsayılan olarak Yeni al.

    public DateTime OlusturulmaTarihi { get; set; } = DateTime.UtcNow;
    public DateTime? GuncellenmeTarihi { get; set; }

    public int OlusturanKullaniciId { get; set; }
    public Kullanici? OlusturanKullanici { get; set; }

    public int? AtananKullaniciId { get; set; }
    public Kullanici? AtananKullanici { get; set; }

    public ICollection<TalepYorum> Yorumlar { get; set; } = new List<TalepYorum>();
    public ICollection<TalepGecmisi> Gecmis { get; set; } = new List<TalepGecmisi>();
}