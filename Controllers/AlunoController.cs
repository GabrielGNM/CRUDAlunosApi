using Domain.Interface;
using Domain.Models;
using Domain.Models.DB;
using Domain.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace CadastroAlunosApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlunoController : ControllerBase
    {
        private readonly IAlunoService _alunoService;

        public AlunoController(IAlunoService alunoService)
        {
            _alunoService = alunoService;
        }

        [HttpGet("buscar/{nome}")]
        public ActionResult<IEnumerable<Aluno>> GetAlunoByNome(string nome)
        {
            var resultado = _alunoService.BuscarAlunosPorNome(nome);
            if (resultado == null || !resultado.Any())
            {
                return NotFound("Aluno não encontrado.");
            }
            return Ok(resultado);
        }

        [HttpGet("buscar-todos")]
        public ActionResult<IEnumerable<Aluno>> BuscarTodos()
        {
            var alunos = _alunoService.BuscarTodosAlunos();
            if (alunos == null || !alunos.Any())
            {
                return NotFound("Nenhum aluno encontrado.");
            }
            return Ok(alunos);
        }

        [HttpPost("cadastrar")]
        public ActionResult<Aluno> CadastrarAluno([FromBody] AlunoDto novoAluno)
        {
            try
            {
                var alunoCadastrado = _alunoService.CadastrarAluno(novoAluno);
                return CreatedAtAction(nameof(GetAlunoById), new { id = alunoCadastrado.Matricula }, alunoCadastrado);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{matricula}")]
        public ActionResult<Aluno> GetAlunoById(string matricula)
        {
            var aluno = _alunoService.BuscarAlunoPorMatricula(matricula);
            if (aluno == null)
            {
                return NotFound("Aluno não encontrado.");
            }
            return Ok(aluno);
        }

        [HttpPut("atualizar/{matricula}")]
        public ActionResult AtualizarAluno(string matricula, [FromBody] AlunoDto alunoAtualizado)
        {
            var aluno = _alunoService.AtualizarAluno(matricula, alunoAtualizado);
            if (aluno == null)
            {
                return NotFound("Aluno não encontrado.");
            }
            return NoContent();
        }
    }
}
