namespace RequestManagement.Domain.Entities;

public class Kullanici
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Eposta { get; set; } = string.Empty;
    public string SifreHash { get; set; } = string.Empty;
    public string Rol { get; set; } = "Kullanici";

    public ICollection<Talep> OlusturulanTalepler { get; set; } = new List<Talep>();
    public ICollection<Talep> AtananTalepler { get; set; } = new List<Talep>();
}