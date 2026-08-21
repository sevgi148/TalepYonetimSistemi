using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RequestManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDepartmentEntityAndSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "DepartmentId",
                table: "Requests",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Departments",
                columns: new[] { "Id", "CreatedAt", "Description", "IsActive", "Name" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Yazılım ve sistem geliştirme talepleri", true, "Yazılım Destek Ekibi" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Bilgisayar, sunucu ve çevre birimleri", true, "Donanım & Sistem Yönetimi" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "İnternet, VPN ve siber güvenlik", true, "Ağ ve Güvenlik Birimi" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Personel ve özlük işleri talepleri", true, "İnsan Kaynakları" },
                    { new Guid("55555555-5555-5555-5555-555555555555"), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Genel ofis ve malzeme talepleri", true, "İdari İşler" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Requests_DepartmentId",
                table: "Requests",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_Departments_DepartmentId",
                table: "Requests",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Requests_Departments_DepartmentId",
                table: "Requests");

            migrationBuilder.DropTable(
                name: "Departments");

            migrationBuilder.DropIndex(
                name: "IX_Requests_DepartmentId",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "Requests");
        }
    }
}
