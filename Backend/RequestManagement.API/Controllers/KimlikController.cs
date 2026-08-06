using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RequestManagement.API.Data;
using RequestManagement.API.DTOs;
using RequestManagement.API.Models;

namespace RequestManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KimlikController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public KimlikController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("kayit")]
    public async Task<IActionResult> KayitOl(KullaniciKayitDto dto)
    {
        if (await _context.Kullanicilar.AnyAsync(u => u.Eposta == dto.Eposta))
        {
            return BadRequest("Bu e-posta adresi zaten kullanımda.");
        }

        var yeniKullanici = new Kullanici
        {
            KullaniciAdi = dto.KullaniciAdi,
            Eposta = dto.Eposta,
            Sifre = Convert.ToBase64String(Encoding.UTF8.GetBytes(dto.Sifre ?? "")),
            Rol = dto.Rol,
            Birim = dto.Birim
        };

        _context.Kullanicilar.Add(yeniKullanici);
        await _context.SaveChangesAsync();

        return Ok(new { Mesaj = "Kayıt işlemi başarılı!" });
    }

    [HttpPost("giris")]
    public async Task<IActionResult> GirisYap(KullaniciGirisDto dto)
    {
        var kullanici = await _context.Kullanicilar.FirstOrDefaultAsync(u => u.Eposta == dto.Eposta);
        if (kullanici == null)
        {
            return BadRequest("Kullanıcı bulunamadı.");
        }

        var sifreHash = Convert.ToBase64String(Encoding.UTF8.GetBytes(dto.Sifre ?? ""));
        if (kullanici.Sifre != sifreHash)
        {
            return BadRequest("Hatalı şifre.");
        }

        var token = TokenOlustur(kullanici);

        return Ok(new KimlikYanitDto
        {
            Token = token,
            KullaniciAdi = kullanici.KullaniciAdi,
            Eposta = kullanici.Eposta,
            Rol = kullanici.Rol
        });
    }

    private string TokenOlustur(Kullanici kullanici)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, kullanici.Id.ToString()),
            new Claim(ClaimTypes.NameIdentifier, kullanici.Id.ToString()),
            new Claim(ClaimTypes.Name, kullanici.KullaniciAdi),
            new Claim(ClaimTypes.Email, kullanici.Eposta),
            new Claim(ClaimTypes.Role, kullanici.Rol)
        };

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}