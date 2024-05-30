using Domain.Models.Dto;
using System.Text.RegularExpressions;

namespace Domain.Models.DB;

public class Aluno
{
    public Guid Id { get; set; }
    public required string Matricula { get; set; }
    public string? Email { get; set; }
    public string? Endereco { get; set; }
    public long Telefone { get; set; }
    public required string CpfCnpj { get; set; }
    public required string Nome { get; set; }
    public required DateTime DataNascimento { get; set; }

    public static Aluno CriaAluno(AlunoDto aluno)
    {
        ValidarAluno(aluno);

        var dataNascimento = aluno.DataNascimento == null ? throw new ValidationException("Data de Nascimento não informada.") : (DateTime)aluno.DataNascimento;
        var telefone = aluno.Telefone == null ? throw new ValidationException("Telefone não informado.") : (long)aluno.Telefone;

        var matricula = CriaMatricula(aluno.Nome!, dataNascimento, aluno.CpfCnpj!);

        // Remove acentos e caracteres especiais
        matricula = RemoveAcentos(matricula);

        return new Aluno
        {

            Id = Guid.NewGuid(),
            Matricula = matricula,
            Email = aluno.Email,
            Endereco = aluno.Endereco,
            Telefone = telefone,
            CpfCnpj = aluno.CpfCnpj!,
            Nome = aluno.Nome!,
            DataNascimento = dataNascimento

        };
    }
    private static void ValidarAluno(AlunoDto aluno)
    {
        if (string.IsNullOrWhiteSpace(aluno.Nome))
        {
            throw new ValidationException("Nome é obrigatório.");
        }
        if (aluno.Nome.Split(' ').Length < 2)
        {
            throw new ValidationException("Nome deve conter pelo menos um nome e um sobrenome.");
        }
        if (string.IsNullOrWhiteSpace(aluno.CpfCnpj))
        {
            throw new ValidationException("CPF/CNPJ é obrigatório.");
        }
        if (aluno.Telefone.ToString().Length < 10)
        {
            throw new ValidationException("Telefone deve conter pelo menos 10 dígitos.");
        }
        if (aluno.DataNascimento == default(DateTime))
        {
            throw new ValidationException("Data de nascimento é obrigatória.");
        }
    }
    private static string CriaMatricula(string nome, DateTime dataNascimento, string CpfCnpj)
    {
        string cleanedCpfCnpj = Regex.Replace(CpfCnpj, "[^a-zA-Z0-9]", "");

        var primeirosTresCpfCnpj = cleanedCpfCnpj[..3];
        var ultimosTresCpfCnpj = cleanedCpfCnpj[3..];
        var nomes = nome.Split(' ');
        var primeiroNome = nomes.First();
        var ultimoNome = nomes.Last();
        var dataNascimentoFormatada = dataNascimento.ToString("ddMMyyyy");

        return $"{primeiroNome}.{primeirosTresCpfCnpj}{ultimoNome}{ultimosTresCpfCnpj}-{dataNascimentoFormatada}";
    }

    public static Aluno AtualizaAluno(AlunoDto atualizacao, Aluno alunoExistente )
    {
        alunoExistente.Email = atualizacao.Email ?? alunoExistente.Email;
        alunoExistente.Endereco = atualizacao.Endereco ?? alunoExistente.Endereco;
        alunoExistente.Telefone = atualizacao.Telefone ?? alunoExistente.Telefone;
        alunoExistente.CpfCnpj = atualizacao.CpfCnpj ?? alunoExistente.CpfCnpj;
        alunoExistente.Nome = atualizacao.Nome ?? alunoExistente.Nome;
        alunoExistente.DataNascimento = atualizacao.DataNascimento ?? alunoExistente.DataNascimento;

        return alunoExistente;
    }
    private static string RemoveAcentos(string texto)
    {
        var comAcentos = "áàâãäéèêëíìîïóòôõöúùûüç";
        var semAcentos = "aaaaaeeeeiiiiooooouuuuc";

        for (int i = 0; i < comAcentos.Length; i++)
        {
            texto = texto.Replace(comAcentos[i], semAcentos[i]);
        }

        texto = Regex.Replace(texto, @"[^a-zA-Z0-9.]", string.Empty);

        return texto;
    }
}
