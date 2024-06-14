using Domain.Models.DB;
using Domain.Models.Dto;

namespace Domain.Interface
{
    public interface IAlunoService
    {
        Aluno CadastrarAluno(AlunoDto novoAluno);
        Aluno? BuscarAlunoPorMatricula(string matricula);
        IEnumerable<Aluno> BuscarAlunosPorNome(string nome);
        Aluno? AtualizarAluno(string matricula, AlunoDto alunoAtualizado);
        IEnumerable<Aluno> BuscarTodosAlunos();
        string RemoverAluno(string matricula);
    }
}
