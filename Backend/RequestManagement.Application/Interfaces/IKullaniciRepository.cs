using RequestManagement.Domain.Entities;

namespace RequestManagement.Application.Interfaces;

public interface IKullaniciRepository
{
    Task<Kullanici?> EpostaIleGetirAsync(string eposta);
    Task<bool> EpostaVarMiAsync(string eposta);
    Task EkleAsync(Kullanici kullanici);
}