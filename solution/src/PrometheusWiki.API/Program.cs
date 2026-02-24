using System.Text;
using Hangfire;
using Hangfire.MySql;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using PrometheusWiki.API.AI;
using PrometheusWiki.API.Hubs;
using PrometheusWiki.API.Jobs;
using PrometheusWiki.API.Services;
using PrometheusWiki.Core.Interfaces.Services;
using PrometheusWiki.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Infrastructure (EF Core + repositories)
builder.Services.AddInfrastructure(builder.Configuration);

// Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };

        // Allow SignalR to receive the JWT via query string
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// SignalR
builder.Services.AddSignalR();

// Hangfire
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddHangfire(config =>
    config.UseStorage(new MySqlStorage(connectionString, new MySqlStorageOptions
    {
        TablesPrefix = "hangfire_"
    })));
builder.Services.AddHangfireServer();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Application services
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ITopicService, TopicService>();
builder.Services.AddScoped<IWikiService, WikiService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

// AI providers
builder.Services.AddScoped<AnthropicProvider>();
builder.Services.AddScoped<OpenAIProvider>();
builder.Services.AddScoped<AIProviderFactory>();

// Background jobs
builder.Services.AddScoped<ArchiveTimeoutJob>();
builder.Services.AddScoped<AIAnswerJob>();

var app = builder.Build();

// Middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngularDev");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");

// Hangfire dashboard (admin only in production)
app.MapHangfireDashboard("/hangfire");

// Schedule recurring jobs
RecurringJob.AddOrUpdate<ArchiveTimeoutJob>(
    "archive-stale-topics",
    job => job.ExecuteAsync(),
    Cron.Daily);

RecurringJob.AddOrUpdate<AIAnswerJob>(
    "ai-answer-generation",
    job => job.ExecuteAsync(),
    Cron.Hourly);

app.Run();
