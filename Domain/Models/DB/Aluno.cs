﻿using Domain.Models.Dto;
using System.Text.RegularExpressions;

namespace Domain.Models.DB;

public class Aluno
{
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

        var matricula = CriaMatricula(aluno.Nome!);

        // Remove acentos e caracteres especiais
        matricula = RemoveAcentos(matricula);

        return new Aluno
        {

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
        if (aluno.Telefone == null) throw new ValidationException("Telefone é obrigatorio.");
        else if (aluno.Telefone.ToString()!.Length < 11) throw new ValidationException("Telefone deve conter pelo menos 11 dígitos.ex:31912345678");

        if (aluno.DataNascimento == null)
            throw new ValidationException("Data de nascimento é obrigatória.");
        else if (aluno.DataNascimento == default(DateTime))
            throw new ValidationException("Data de nascimento com formato incorreto.");
    }
    private static void ValidarAtualizacaoAluno(AlunoDto aluno)
    {
        if (aluno.Nome != null){
            if (aluno!.Nome.Split(' ').Length < 2)
                throw new ValidationException("Nome deve conter pelo menos um nome e um sobrenome.");
        }
        if (aluno.Telefone != null)
        {
            if (aluno!.Telefone.ToString()!.Length < 11)
                throw new ValidationException("Telefone deve conter pelo menos 11 dígitos.ex:31912345678");
        }
        
        if (aluno.DataNascimento != null)
        {
            if (aluno.DataNascimento == default(DateTime))
                throw new ValidationException("Data de nascimento com formato incorreto.");
        }
    }
    private static string CriaMatricula(string nome)
    {
        Random random = new();

        // Gera um número aleatório entre 1 e 999999
        int matriculaNumero = random.Next(1, 1000000);
        // Formata o número com 6 dígitos, preenchendo com zeros à esquerda
        string matriculaNumeroFormatado = matriculaNumero.ToString("D6");
        var nomes = nome.Split(' ');
        var primeiroNome = nomes.First();

        return $"{primeiroNome}.{matriculaNumeroFormatado}";
    }

    public static Aluno AtualizarAluno(AlunoDto atualizacao, Aluno alunoExistente, ref List<Aluno> ListaAlunos)
    {
        ValidarAtualizacaoAluno(atualizacao);
        var aluno = ListaAlunos.FirstOrDefault(a => a == alunoExistente);

        aluno.Email = atualizacao.Email ?? alunoExistente.Email;
        aluno.Endereco = atualizacao.Endereco ?? alunoExistente.Endereco;
        aluno.Telefone = atualizacao.Telefone ?? alunoExistente.Telefone;
        aluno.CpfCnpj = atualizacao.CpfCnpj ?? alunoExistente.CpfCnpj;
        aluno.Nome = atualizacao.Nome ?? alunoExistente.Nome;
        aluno.DataNascimento = atualizacao.DataNascimento ?? alunoExistente.DataNascimento;

        return aluno;
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
