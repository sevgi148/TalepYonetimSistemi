namespace RequestManagement.API.DTOs;

public class KullaniciKayitDto
{
    public string KullaniciAdi { get; set; } = string.Empty;
    public string Eposta { get; set; } = string.Empty;
    public string Sifre { get; set; } = string.Empty;
    public string Rol { get; set; } = "Kullanici";
    public string? Birim { get; set; }
}