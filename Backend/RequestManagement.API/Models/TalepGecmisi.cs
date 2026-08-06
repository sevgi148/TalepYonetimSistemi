namespace RequestManagement.API.Models;

public class TalepGecmisi
{
    public int Id { get; set; }
    
    public int TalepId { get; set; }
    public Talep? Talep { get; set; }

    public int IslemYapanKullaniciId { get; set; }
    public Kullanici? IslemYapanKullanici { get; set; }

    public string EskiDurum { get; set; } = string.Empty;
    public string YeniDurum { get; set; } = string.Empty;
    public string Aciklama { get; set; } = string.Empty;

    public DateTime IslemTarihi { get; set; } = DateTime.UtcNow;
}