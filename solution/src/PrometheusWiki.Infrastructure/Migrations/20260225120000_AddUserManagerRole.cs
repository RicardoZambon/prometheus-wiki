using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PrometheusWiki.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserManagerRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "roles",
                columns: new[] { "Id", "Name" },
                values: new object[] { 4, "UserManager" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "roles",
                keyColumn: "Id",
                keyValue: 4);
        }
    }
}
