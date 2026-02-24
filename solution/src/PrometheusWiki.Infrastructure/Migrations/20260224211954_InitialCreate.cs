using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PrometheusWiki.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "app_settings",
                columns: table => new
                {
                    Key = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Value = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_app_settings", x => x.Key);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categories", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "tags",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Slug = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tags", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordHash = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LanguagePreference = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false, defaultValue: "en")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ai_user_context",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ContextSummary = table.Column<string>(type: "text", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastUpdated = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ai_user_context", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ai_user_context_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "notifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ReferenceId = table.Column<int>(type: "int", nullable: false),
                    ReferenceType = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Message = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsRead = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_notifications_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "topics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(type: "varchar(300)", maxLength: 300, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Content = table.Column<string>(type: "text", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false, defaultValue: "Open")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ViewCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_topics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_topics_categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_topics_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "user_roles",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_roles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_user_roles_roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_roles_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "wiki_pages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ParentId = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "varchar(300)", maxLength: 300, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BaseLanguage = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false, defaultValue: "en")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedById = table.Column<int>(type: "int", nullable: false),
                    UpdatedById = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_wiki_pages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_wiki_pages_users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_wiki_pages_users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_wiki_pages_wiki_pages_ParentId",
                        column: x => x.ParentId,
                        principalTable: "wiki_pages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "answers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TopicId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsSolution = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsAiGenerated = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    AiProvider = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UpvoteCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_answers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_answers_topics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "topics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_answers_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "topic_tags",
                columns: table => new
                {
                    TopicId = table.Column<int>(type: "int", nullable: false),
                    TagId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_topic_tags", x => new { x.TopicId, x.TagId });
                    table.ForeignKey(
                        name: "FK_topic_tags_tags_TagId",
                        column: x => x.TagId,
                        principalTable: "tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_topic_tags_topics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "topics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "wiki_page_translations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    WikiPageId = table.Column<int>(type: "int", nullable: false),
                    Language = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Content = table.Column<string>(type: "text", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsOutdated = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    TranslatedById = table.Column<int>(type: "int", nullable: false),
                    IsAiTranslated = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_wiki_page_translations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_wiki_page_translations_users_TranslatedById",
                        column: x => x.TranslatedById,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_wiki_page_translations_wiki_pages_WikiPageId",
                        column: x => x.WikiPageId,
                        principalTable: "wiki_pages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "wiki_page_versions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    WikiPageId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ChangedById = table.Column<int>(type: "int", nullable: false),
                    VersionNumber = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_wiki_page_versions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_wiki_page_versions_users_ChangedById",
                        column: x => x.ChangedById,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_wiki_page_versions_wiki_pages_WikiPageId",
                        column: x => x.WikiPageId,
                        principalTable: "wiki_pages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "answer_votes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    AnswerId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_answer_votes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_answer_votes_answers_AnswerId",
                        column: x => x.AnswerId,
                        principalTable: "answers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_answer_votes_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "app_settings",
                columns: new[] { "Key", "Description", "UpdatedAt", "Value" },
                values: new object[,]
                {
                    { "ai_enabled", "Whether AI features are enabled", new DateTime(2026, 2, 24, 21, 19, 52, 300, DateTimeKind.Utc).AddTicks(9425), "false" },
                    { "ai_provider", "AI provider to use (Anthropic, OpenAI)", new DateTime(2026, 2, 24, 21, 19, 52, 300, DateTimeKind.Utc).AddTicks(9425), "Anthropic" },
                    { "ai_trigger_delay_hours", "Hours to wait before AI generates an answer", new DateTime(2026, 2, 24, 21, 19, 52, 300, DateTimeKind.Utc).AddTicks(9426), "24" },
                    { "archive_timeout_days", "Days before an unanswered topic is archived", new DateTime(2026, 2, 24, 21, 19, 52, 300, DateTimeKind.Utc).AddTicks(9421), "30" }
                });

            migrationBuilder.InsertData(
                table: "roles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "User" },
                    { 2, "WikiEditor" },
                    { 3, "Admin" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ai_user_context_UserId",
                table: "ai_user_context",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_answer_votes_AnswerId_UserId",
                table: "answer_votes",
                columns: new[] { "AnswerId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_answer_votes_UserId",
                table: "answer_votes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_answers_Content",
                table: "answers",
                column: "Content")
                .Annotation("MySql:FullTextIndex", true);

            migrationBuilder.CreateIndex(
                name: "IX_answers_TopicId",
                table: "answers",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_answers_UserId",
                table: "answers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_UserId_IsRead",
                table: "notifications",
                columns: new[] { "UserId", "IsRead" });

            migrationBuilder.CreateIndex(
                name: "IX_roles_Name",
                table: "roles",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tags_Slug",
                table: "tags",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_topic_tags_TagId",
                table: "topic_tags",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_topics_CategoryId",
                table: "topics",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_topics_Title_Content",
                table: "topics",
                columns: new[] { "Title", "Content" })
                .Annotation("MySql:FullTextIndex", true);

            migrationBuilder.CreateIndex(
                name: "IX_topics_UserId",
                table: "topics",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_user_roles_RoleId",
                table: "user_roles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_Username",
                table: "users",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_wiki_page_translations_TranslatedById",
                table: "wiki_page_translations",
                column: "TranslatedById");

            migrationBuilder.CreateIndex(
                name: "IX_wiki_page_translations_WikiPageId_Language",
                table: "wiki_page_translations",
                columns: new[] { "WikiPageId", "Language" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_wiki_page_versions_ChangedById",
                table: "wiki_page_versions",
                column: "ChangedById");

            migrationBuilder.CreateIndex(
                name: "IX_wiki_page_versions_Content",
                table: "wiki_page_versions",
                column: "Content")
                .Annotation("MySql:FullTextIndex", true);

            migrationBuilder.CreateIndex(
                name: "IX_wiki_page_versions_WikiPageId_VersionNumber",
                table: "wiki_page_versions",
                columns: new[] { "WikiPageId", "VersionNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_wiki_pages_CreatedById",
                table: "wiki_pages",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_wiki_pages_ParentId",
                table: "wiki_pages",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_wiki_pages_Title",
                table: "wiki_pages",
                column: "Title")
                .Annotation("MySql:FullTextIndex", true);

            migrationBuilder.CreateIndex(
                name: "IX_wiki_pages_UpdatedById",
                table: "wiki_pages",
                column: "UpdatedById");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ai_user_context");

            migrationBuilder.DropTable(
                name: "answer_votes");

            migrationBuilder.DropTable(
                name: "app_settings");

            migrationBuilder.DropTable(
                name: "notifications");

            migrationBuilder.DropTable(
                name: "topic_tags");

            migrationBuilder.DropTable(
                name: "user_roles");

            migrationBuilder.DropTable(
                name: "wiki_page_translations");

            migrationBuilder.DropTable(
                name: "wiki_page_versions");

            migrationBuilder.DropTable(
                name: "answers");

            migrationBuilder.DropTable(
                name: "tags");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "wiki_pages");

            migrationBuilder.DropTable(
                name: "topics");

            migrationBuilder.DropTable(
                name: "categories");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
