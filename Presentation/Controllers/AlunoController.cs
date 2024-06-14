using Domain.Interface;
using Domain.Models;
using Domain.Models.DB;
using Domain.Models.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlunoController(IAlunoService alunoService) : ControllerBase
    {
        private readonly IAlunoService _alunoService = alunoService;

        [HttpGet("buscar/{nome}")]
        public ActionResult<IEnumerable<Aluno>> GetAlunoByNome(string nome)
        {
            try
            {
                var resultado = _alunoService.BuscarAlunosPorNome(nome);
                return Ok(resultado);
            }
            catch(ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("buscarTodosAlunos")]
        public ActionResult<IEnumerable<Aluno>> BuscarTodos()
        {
            try
            {
                var alunos = _alunoService.BuscarTodosAlunos();
                return Ok(alunos);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("cadastrar")]
        public ActionResult<Aluno> CadastrarAluno([FromBody] AlunoDto novoAluno)
        {
            try
            {
                var alunoCadastrado = _alunoService.CadastrarAluno(novoAluno);
                return Ok(alunoCadastrado);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{matricula}")]
        public ActionResult<Aluno> GetAlunoById(string matricula)
        {
            try
            {
                var aluno = _alunoService.BuscarAlunoPorMatricula(matricula);
                return Ok(aluno);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("atualizar/{matricula}")]
        public ActionResult<Aluno> AtualizarAluno(string matricula, [FromBody] AlunoDto alunoAtualizado)
        {
            try
            {
            var aluno = _alunoService.AtualizarAluno(matricula, alunoAtualizado);
            return Ok(aluno);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("remover/{matricula}")]
        public ActionResult RemoverAluno(string matricula)
        {
            try
            {
            var response = _alunoService.RemoverAluno(matricula);
            return Ok(response);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
