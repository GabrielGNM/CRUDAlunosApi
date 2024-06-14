namespace Domain.Models.Dto
{
    public record AlunoDto
    {
        public string? Email { get; set; }
        public string? Endereco { get; set; }
        public long? Telefone { get; set; }
        public string? CpfCnpj { get; set; }
        public string? Nome { get; set; }
        public DateTime? DataNascimento { get; set; }
    }
}
