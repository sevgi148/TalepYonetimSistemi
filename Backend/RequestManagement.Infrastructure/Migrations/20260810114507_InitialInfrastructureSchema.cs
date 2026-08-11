using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RequestManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialInfrastructureSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Kullanicilar",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Eposta = table.Column<string>(type: "text", nullable: false),
                    SifreHash = table.Column<string>(type: "text", nullable: false),
                    Rol = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kullanicilar", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Talepler",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Baslik = table.Column<string>(type: "text", nullable: false),
                    Aciklama = table.Column<string>(type: "text", nullable: false),
                    Oncelik = table.Column<int>(type: "integer", nullable: false),
                    Durum = table.Column<int>(type: "integer", nullable: false),
                    OlusturanKullaniciId = table.Column<Guid>(type: "uuid", nullable: false),
                    AtananKullaniciId = table.Column<Guid>(type: "uuid", nullable: true),
                    OlusturulmaTarihi = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    GuncellenmeTarihi = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Talepler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Talepler_Kullanicilar_AtananKullaniciId",
                        column: x => x.AtananKullaniciId,
                        principalTable: "Kullanicilar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Talepler_Kullanicilar_OlusturanKullaniciId",
                        column: x => x.OlusturanKullaniciId,
                        principalTable: "Kullanicilar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TalepGecmisleri",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TalepId = table.Column<Guid>(type: "uuid", nullable: false),
                    KullaniciId = table.Column<Guid>(type: "uuid", nullable: false),
                    EskiDurum = table.Column<int>(type: "integer", nullable: false),
                    YeniDurum = table.Column<int>(type: "integer", nullable: false),
                    Aciklama = table.Column<string>(type: "text", nullable: true),
                    OlusturulmaTarihi = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TalepGecmisleri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TalepGecmisleri_Kullanicilar_KullaniciId",
                        column: x => x.KullaniciId,
                        principalTable: "Kullanicilar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TalepGecmisleri_Talepler_TalepId",
                        column: x => x.TalepId,
                        principalTable: "Talepler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TalepYorumlari",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Yorum = table.Column<string>(type: "text", nullable: false),
                    OlusturulmaTarihi = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TalepId = table.Column<Guid>(type: "uuid", nullable: false),
                    KullaniciId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TalepYorumlari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TalepYorumlari_Kullanicilar_KullaniciId",
                        column: x => x.KullaniciId,
                        principalTable: "Kullanicilar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TalepYorumlari_Talepler_TalepId",
                        column: x => x.TalepId,
                        principalTable: "Talepler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TalepGecmisleri_KullaniciId",
                table: "TalepGecmisleri",
                column: "KullaniciId");

            migrationBuilder.CreateIndex(
                name: "IX_TalepGecmisleri_TalepId",
                table: "TalepGecmisleri",
                column: "TalepId");

            migrationBuilder.CreateIndex(
                name: "IX_Talepler_AtananKullaniciId",
                table: "Talepler",
                column: "AtananKullaniciId");

            migrationBuilder.CreateIndex(
                name: "IX_Talepler_OlusturanKullaniciId",
                table: "Talepler",
                column: "OlusturanKullaniciId");

            migrationBuilder.CreateIndex(
                name: "IX_TalepYorumlari_KullaniciId",
                table: "TalepYorumlari",
                column: "KullaniciId");

            migrationBuilder.CreateIndex(
                name: "IX_TalepYorumlari_TalepId",
                table: "TalepYorumlari",
                column: "TalepId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TalepGecmisleri");

            migrationBuilder.DropTable(
                name: "TalepYorumlari");

            migrationBuilder.DropTable(
                name: "Talepler");

            migrationBuilder.DropTable(
                name: "Kullanicilar");
        }
    }
}
