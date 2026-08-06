using RequestManagement.API.Models;

namespace RequestManagement.API.DTOs;

public class TalepOlusturDto
{
    public string Baslik { get; set; } = string.Empty;
    public string Aciklama { get; set; } = string.Empty;
    public string TalepTuru { get; set; } = string.Empty;
    public OncelikSeviyesi Oncelik { get; set; } = OncelikSeviyesi.Orta;
}