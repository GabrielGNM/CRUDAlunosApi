// Função para realizar requisições à API
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

// Função para buscar alunos por nome
async function buscarAlunosPorNome(nome) {
    const url = `http://localhost:5000/api/aluno/buscar/${nome}`; // Replace with your API URL
    const resultado = await requisicaoAPI(url, 'GET');

    // Exibir resultado na tabela (substitua pela sua lógica de exibição)
    console.log(resultado); // Exemplo de exibição no console
    // Atualize a tabela com os dados recebidos (implemente a atualização da tabela)
}

// Função para cadastrar um novo aluno
async function cadastrarAluno(aluno) {
    const url = 'http://localhost:5000/api/aluno/cadastrar'; // Replace with your API URL
    const novoAluno = {
        ...aluno, // Spread operator to include all properties from 'aluno' object
    };
    const novoAlunoCriado = await requisicaoAPI(url, 'POST', novoAluno);

    // Exibir mensagem de sucesso ou erro (implemente a lógica de exibição)
    console.log(novoAlunoCriado); // Exemplo de exibição no console
    // Exibir mensagem de sucesso ou erro ao usuário (implemente a lógica de feedback)
}

// Função para buscar um aluno por matrícula
async function buscarAlunoPorMatricula(matricula) {
    const url = `http://localhost:5000/api/aluno/${matricula}`; // Replace with your API URL
    const aluno = await requisicaoAPI(url, 'GET');

    // Exibir detalhes do aluno (substitua pela sua lógica de exibição)
    console.log(aluno); // Exemplo de exibição no console
    // Preencha o formulário de edição com os dados do aluno (implemente a edição)
}

// Função para atualizar um aluno
async function atualizarAluno(matricula, dadosAtualizados) {
    const url = `http://localhost:5000/api/aluno/atualizar/${matricula}`; // Replace with your API URL
    const resultado = await requisicaoAPI(url, 'PUT', dadosAtualizados);

    // Exibir mensagem de sucesso ou erro (implemente a lógica de exibição)
    console.log(resultado); // Exemplo de exibição no console
    // Exibir mensagem de sucesso ou erro ao usuário (implemente a lógica de feedback)
}

// Exemplos de uso das funções

// Buscar alunos por nome
buscarAlunosPorNome('João Silva');

// Cadastrar um novo aluno (assuming you have a form to collect data)
const novoAluno = {
    nome: document.getElementById('nomeInput').value, // Replace with your input element ID
    matricula: document.getElementById('matriculaInput').value, // Replace with your input element ID
    curso: document.getElementById('cursoInput').value, // Replace with your input element ID
    // ... other fields (implement logic to get data from your form)
};
cadastrarAluno(novoAluno);

// Buscar um aluno por matrícula
buscarAlunoPorMatricula('12345678');

// Atualizar um aluno (assuming you have an edit form pre-filled with data)
const atualizacao = {
    nome: document.getElementById('editNomeInput').value, // Replace with your edit input element ID
    curso: document.getElementById('editCursoInput').value, // Replace with your edit input element ID
    // ... other fields to update (implement logic to get data from your edit form)
};
atualizarAluno('87654321', atualizacao)