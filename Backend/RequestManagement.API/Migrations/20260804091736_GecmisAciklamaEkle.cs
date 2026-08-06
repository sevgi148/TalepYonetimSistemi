using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RequestManagement.API.Migrations
{
    /// <inheritdoc />
    public partial class GecmisAciklamaEkle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "YorumMetni",
                table: "TalepYorumlari",
                newName: "Yorum");

            migrationBuilder.RenameColumn(
                name: "OlusturulmaTarihi",
                table: "TalepYorumlari",
                newName: "OlusturmaTarihi");

            migrationBuilder.RenameColumn(
                name: "Islem",
                table: "TalepGecmisleri",
                newName: "YeniDurum");

            migrationBuilder.RenameColumn(
                name: "DegistirenKullanici",
                table: "TalepGecmisleri",
                newName: "EskiDurum");

            migrationBuilder.AddColumn<string>(
                name: "Aciklama",
                table: "TalepGecmisleri",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "IslemYapanKullaniciId",
                table: "TalepGecmisleri",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TalepGecmisleri_IslemYapanKullaniciId",
                table: "TalepGecmisleri",
                column: "IslemYapanKullaniciId");

            migrationBuilder.AddForeignKey(
                name: "FK_TalepGecmisleri_Kullanicilar_IslemYapanKullaniciId",
                table: "TalepGecmisleri",
                column: "IslemYapanKullaniciId",
                principalTable: "Kullanicilar",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TalepGecmisleri_Kullanicilar_IslemYapanKullaniciId",
                table: "TalepGecmisleri");

            migrationBuilder.DropIndex(
                name: "IX_TalepGecmisleri_IslemYapanKullaniciId",
                table: "TalepGecmisleri");

            migrationBuilder.DropColumn(
                name: "Aciklama",
                table: "TalepGecmisleri");

            migrationBuilder.DropColumn(
                name: "IslemYapanKullaniciId",
                table: "TalepGecmisleri");

            migrationBuilder.RenameColumn(
                name: "Yorum",
                table: "TalepYorumlari",
                newName: "YorumMetni");

            migrationBuilder.RenameColumn(
                name: "OlusturmaTarihi",
                table: "TalepYorumlari",
                newName: "OlusturulmaTarihi");

            migrationBuilder.RenameColumn(
                name: "YeniDurum",
                table: "TalepGecmisleri",
                newName: "Islem");

            migrationBuilder.RenameColumn(
                name: "EskiDurum",
                table: "TalepGecmisleri",
                newName: "DegistirenKullanici");
        }
    }
}
