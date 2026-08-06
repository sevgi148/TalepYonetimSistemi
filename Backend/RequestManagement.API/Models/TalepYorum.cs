namespace RequestManagement.API.Models;

public class TalepYorum
{
    public int Id { get; set; }

    public int TalepId { get; set; }
    public Talep? Talep { get; set; }

    public int KullaniciId { get; set; }
    public Kullanici? Kullanici { get; set; }

    public string Yorum { get; set; } = string.Empty;
    public DateTime OlusturmaTarihi { get; set; } = DateTime.UtcNow;
}