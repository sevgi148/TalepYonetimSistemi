namespace RequestManagement.API.DTOs;

public class KimlikYanitDto
{
    public string Token { get; set; } = string.Empty;
    public string KullaniciAdi { get; set; } = string.Empty;
    public string Eposta { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
}