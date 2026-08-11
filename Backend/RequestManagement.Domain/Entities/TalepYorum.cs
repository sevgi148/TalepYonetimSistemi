namespace RequestManagement.Domain.Entities;

public class TalepYorum
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Yorum { get; set; } = string.Empty;
    public DateTime OlusturulmaTarihi { get; set; } = DateTime.UtcNow;

    public Guid TalepId { get; set; }
    public Talep Talep { get; set; } = null!;

    public Guid KullaniciId { get; set; }
    public Kullanici Kullanici { get; set; } = null!;
}