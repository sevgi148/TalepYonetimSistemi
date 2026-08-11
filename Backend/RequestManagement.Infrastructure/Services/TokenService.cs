using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using RequestManagement.Application.Interfaces;
using RequestManagement.Domain.Entities;

namespace RequestManagement.Infrastructure.Services;

public class TokenService(IConfiguration configuration) : ITokenService
{
    public string TokenOlustur(Kullanici kullanici)
    {
        var secretKey = configuration["Jwt:Key"] ?? "TalepYonetimSistemi_GizliGuvenliJwtKey_2026_!";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, kullanici.Id.ToString()),
            new(ClaimTypes.NameIdentifier, kullanici.Id.ToString()),
            new(ClaimTypes.Email, kullanici.Eposta),
            new(ClaimTypes.Role, kullanici.Rol)
        };

        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}