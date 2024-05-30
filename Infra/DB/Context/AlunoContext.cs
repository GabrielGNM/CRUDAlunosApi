using Domain.Models.DB;
using Microsoft.EntityFrameworkCore;

namespace Infra.DB.Context;

public class AppDbContext : DbContext
{
    public DbSet<Aluno> Alunos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("YourConnectionStringHere");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configurações adicionais de mapeamento
    }
}
