using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RequestManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddYorumVeGecmis : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TalepGecmisleri_Kullanicilar_KullaniciId",
                table: "TalepGecmisleri");

            migrationBuilder.DropForeignKey(
                name: "FK_TalepYorumlari_Kullanicilar_KullaniciId",
                table: "TalepYorumlari");

            migrationBuilder.DropForeignKey(
                name: "FK_TalepYorumlari_Talepler_TalepId",
                table: "TalepYorumlari");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TalepYorumlari",
                table: "TalepYorumlari");

            migrationBuilder.RenameTable(
                name: "TalepYorumlari",
                newName: "Yorumlar");

            migrationBuilder.RenameIndex(
                name: "IX_TalepYorumlari_TalepId",
                table: "Yorumlar",
                newName: "IX_Yorumlar_TalepId");

            migrationBuilder.RenameIndex(
                name: "IX_TalepYorumlari_KullaniciId",
                table: "Yorumlar",
                newName: "IX_Yorumlar_KullaniciId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Yorumlar",
                table: "Yorumlar",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TalepGecmisleri_Kullanicilar_KullaniciId",
                table: "TalepGecmisleri",
                column: "KullaniciId",
                principalTable: "Kullanicilar",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Yorumlar_Kullanicilar_KullaniciId",
                table: "Yorumlar",
                column: "KullaniciId",
                principalTable: "Kullanicilar",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Yorumlar_Talepler_TalepId",
                table: "Yorumlar",
                column: "TalepId",
                principalTable: "Talepler",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TalepGecmisleri_Kullanicilar_KullaniciId",
                table: "TalepGecmisleri");

            migrationBuilder.DropForeignKey(
                name: "FK_Yorumlar_Kullanicilar_KullaniciId",
                table: "Yorumlar");

            migrationBuilder.DropForeignKey(
                name: "FK_Yorumlar_Talepler_TalepId",
                table: "Yorumlar");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Yorumlar",
                table: "Yorumlar");

            migrationBuilder.RenameTable(
                name: "Yorumlar",
                newName: "TalepYorumlari");

            migrationBuilder.RenameIndex(
                name: "IX_Yorumlar_TalepId",
                table: "TalepYorumlari",
                newName: "IX_TalepYorumlari_TalepId");

            migrationBuilder.RenameIndex(
                name: "IX_Yorumlar_KullaniciId",
                table: "TalepYorumlari",
                newName: "IX_TalepYorumlari_KullaniciId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TalepYorumlari",
                table: "TalepYorumlari",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TalepGecmisleri_Kullanicilar_KullaniciId",
                table: "TalepGecmisleri",
                column: "KullaniciId",
                principalTable: "Kullanicilar",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TalepYorumlari_Kullanicilar_KullaniciId",
                table: "TalepYorumlari",
                column: "KullaniciId",
                principalTable: "Kullanicilar",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TalepYorumlari_Talepler_TalepId",
                table: "TalepYorumlari",
                column: "TalepId",
                principalTable: "Talepler",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
