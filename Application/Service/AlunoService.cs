using Domain.Interface;
using Domain.Models;
using Domain.Models.DB;
using Domain.Models.Dto;

namespace Application.Service
{
    public class AlunoService : IAlunoService
    {
        private static List<Aluno> alunos = new List<Aluno>();
        public Aluno AtualizarAluno(string matricula, AlunoDto atualizacao)
        {
            var alunoExistente = BuscarAlunoPorMatricula(matricula);

            var alunoAtualizado = Aluno.AtualizaAluno(atualizacao, alunoExistente);

            return alunoAtualizado;
        }

        public Aluno? BuscarAlunoPorMatricula(string matricula)
        {
            return alunos.FirstOrDefault(a => a.Matricula == matricula);
        }

        public IEnumerable<Aluno> BuscarAlunosPorNome(string nome)
        {
            return alunos.Where(a => a.Nome.Contains(nome, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        public Aluno CadastrarAluno(AlunoDto input)
        {
            var novoAluno = Aluno.CriaAluno(input);
            var alunoExistente = BuscarAlunoPorMatricula(novoAluno.Matricula);
            if (alunoExistente != null) throw new ValidationException("Aluno já Cadastrado");
            return alunoExistente;            
        }
    }
}
