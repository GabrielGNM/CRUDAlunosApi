


// Fun��o para realizar requisi��es � API
async function requisicaoAPI(url, metodo, dados = null) {
    const requisicao = await fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: dados ? JSON.stringify(dados) : null
    });

    const json = await requisicao.json();
    return json;
}


//converte data no formato string para o formato dd/mm/aaaa
const formatDate = function(data) {
    // Converter a string para um objeto Date
    let dateObject = new Date(data);

    // Acessar os componentes individuais da data
    let year = dateObject.getUTCFullYear();
    let month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0'); 
    let day = dateObject.getUTCDate().toString().padStart(2, '0');

    // Formatar a data no formato MM/DD/YYYY
    let formattedDate = `${day}/${month}/${year}`;

    return formattedDate
}


//Retorna todos os registros
async function buscarAlunosTodos() {
    const url = `https://localhost:5000/api/Aluno/alunos`; // Replace with your API URL
    const resultado = await requisicaoAPI(url, 'GET');

    if (Array.isArray(resultado)) {
        let content = document.getElementById('contentAlunos')
        let contentLine = ''
        resultado.forEach(e => {
            date = formatDate(e.dataNascimento)
            contentLine += `
            <tr >
                <td>${e.nome}</td>
                <td>${date}</td>
                <td>${e.telefone}</td>
                <td>${e.email}</td>
                <td><a href="" data-bs-toggle="modal" data-bs-target="#formEditAluno"><box-icon name='edit'></box-icon></a></td>
                <td><a href="" data-bs-toggle="modal" data-bs-target="#apagarAluno"><box-icon type='solid' name='user-x'></box-icon></a></td>
            </tr>
            `        
        });
        content.innerHTML = contentLine
    }      
}


buscarAlunosTodos()
















// // Fun��o para realizar requisi��es � API
// async function requisicaoAPI(url, metodo, dados = null) {
//     const requisicao = await fetch(url, {
//         method: metodo,
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: dados ? JSON.stringify(dados) : null
//     });

//     const json = await requisicao.json();
//     return json;
// }

// // Fun��o para buscar alunos por nome
// async function buscarAlunosPorNome(nome) {
//     const url = `http://localhost:5000/api/aluno/buscar/${nome}`; // Replace with your API URL
//     const resultado = await requisicaoAPI(url, 'GET');

//     // Exibir resultado na tabela (substitua pela sua l�gica de exibi��o)
//     console.log(resultado); // Exemplo de exibi��o no console
//     // Atualize a tabela com os dados recebidos (implemente a atualiza��o da tabela)
// }

// // Fun��o para cadastrar um novo aluno
// async function cadastrarAluno(aluno) {
//     const url = 'http://localhost:5000/api/aluno/cadastrar'; // Replace with your API URL
//     const novoAluno = {
//         ...aluno, // Spread operator to include all properties from 'aluno' object
//     };
//     const novoAlunoCriado = await requisicaoAPI(url, 'POST', novoAluno);

//     // Exibir mensagem de sucesso ou erro (implemente a l�gica de exibi��o)
//     console.log(novoAlunoCriado); // Exemplo de exibi��o no console
//     // Exibir mensagem de sucesso ou erro ao usu�rio (implemente a l�gica de feedback)
// }

// // Fun��o para buscar um aluno por matr�cula
// async function buscarAlunoPorMatricula(matricula) {
//     const url = `http://localhost:5000/api/aluno/${matricula}`; // Replace with your API URL
//     const aluno = await requisicaoAPI(url, 'GET');

//     // Exibir detalhes do aluno (substitua pela sua l�gica de exibi��o)
//     console.log(aluno); // Exemplo de exibi��o no console
//     // Preencha o formul�rio de edi��o com os dados do aluno (implemente a edi��o)
// }

// // Fun��o para atualizar um aluno
// async function atualizarAluno(matricula, dadosAtualizados) {
//     const url = `http://localhost:5000/api/aluno/atualizar/${matricula}`; // Replace with your API URL
//     const resultado = await requisicaoAPI(url, 'PUT', dadosAtualizados);

//     // Exibir mensagem de sucesso ou erro (implemente a l�gica de exibi��o)
//     console.log(resultado); // Exemplo de exibi��o no console
//     // Exibir mensagem de sucesso ou erro ao usu�rio (implemente a l�gica de feedback)
// }

// // Exemplos de uso das fun��es

// // Buscar alunos por nome
// buscarAlunosPorNome('Jo�o Silva');

// // Cadastrar um novo aluno (assuming you have a form to collect data)
// const novoAluno = {
//     nome: document.getElementById('nomeInput').value, // Replace with your input element ID
//     matricula: document.getElementById('matriculaInput').value, // Replace with your input element ID
//     curso: document.getElementById('cursoInput').value, // Replace with your input element ID
//     // ... other fields (implement logic to get data from your form)
// };
// cadastrarAluno(novoAluno);

// // Buscar um aluno por matr�cula
// buscarAlunoPorMatricula('12345678');

// // Atualizar um aluno (assuming you have an edit form pre-filled with data)
// const atualizacao = {
//     nome: document.getElementById('editNomeInput').value, // Replace with your edit input element ID
//     curso: document.getElementById('editCursoInput').value, // Replace with your edit input element ID
//     // ... other fields to update (implement logic to get data from your edit form)
// };
// atualizarAluno('87654321', atualizacao)