namespace RequestManagement.API.Models;

public class Kullanici
{
    public int Id { get; set; }
    public string KullaniciAdi { get; set; } = string.Empty;
    public string Eposta { get; set; } = string.Empty;
    public string Sifre { get; set; } = string.Empty;
    public string Rol { get; set; } = "Kullanici"; 
    public string? Birim { get; set; } 
}