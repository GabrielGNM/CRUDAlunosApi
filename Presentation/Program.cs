using Application.Service;
using Domain.Interface;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews(); // MVC controllers
builder.Services.AddControllers(); // Web API controllers

// Registering the service
builder.Services.AddScoped<IAlunoService, AlunoService>(); // Service registration

// Configuring Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API de Alunos", Version = "v1" });
    // Additional Swagger configuration can go here
});

// Configuring CORS
builder.Services.AddCors(options =>
{ 
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// Enable CORS with the specified policy
app.UseCors("AllowAll");

app.UseRouting();
app.UseAuthorization();

// Swagger configurations
if (app.Environment.IsDevelopment() || app.Environment.IsStaging())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API de Alunos v1");
        c.RoutePrefix = string.Empty; // Swagger UI will be available at the root
    });
}

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=HomePage}/{action=HomePage}/{id?}");

app.MapControllers();

app.Run();
