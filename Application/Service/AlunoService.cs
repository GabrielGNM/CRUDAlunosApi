using Domain.Interface;
using Domain.Models;
using Domain.Models.DB;
using Domain.Models.Dto;

namespace Application.Service
{
    public class AlunoService : IAlunoService
    {
        private static List<Aluno> ListaAlunos = [];
        public Aluno? AtualizarAluno(string matricula, AlunoDto atualizacao)
        {
            var alunoExistente = BuscarAlunoPorMatricula(matricula);
            if (alunoExistente != null)
            {
                var alunoAtualizado = Aluno.AtualizaAluno(atualizacao, alunoExistente!, ListaAlunos);

                return alunoAtualizado;
            }
            else
            {
                return null;
            }
            
        }

        public Aluno? BuscarAlunoPorMatricula(string matricula)
        {
            try
            {
                return ListaAlunos.FirstOrDefault(a => a.Matricula == matricula);
            }
            catch
            {
                return null;
            }
        }

        public IEnumerable<Aluno> BuscarAlunosPorNome(string nome)
        {
            return ListaAlunos.Where(a => a.Nome.Contains(nome, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        public IEnumerable<Aluno> BuscarTodosAlunos()
        {
            return ListaAlunos;
        }

        public Aluno CadastrarAluno(AlunoDto input)
        {
            var novoAluno = Aluno.CriaAluno(input);
            var alunoExistente = BuscarAlunoPorMatricula(novoAluno.Matricula);
            if (alunoExistente != null) throw new ValidationException("Aluno já Cadastrado");
            ListaAlunos.Add(novoAluno);
            return novoAluno;            
        }
    }
}
