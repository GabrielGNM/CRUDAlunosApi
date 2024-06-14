


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


// Função para preencher o formulário com os dados do aluno
function fillForm(aluno) {
    document.getElementById('formEditNome').value = aluno.nome;
    document.getElementById('formEditCPF').value = aluno.cpfCnpj;
    document.getElementById('formEditDataNasc').value = formatDate(aluno.dataNascimento);
    document.getElementById('formEditTelefone').value = aluno.telefone;
    document.getElementById('formEditEmail').value = aluno.email;
    document.getElementById('formEditEndereco').value = aluno.endereco;
    document.getElementById('formEditCurso').value = aluno.curso;
    document.getElementById('formEditTurma').value = aluno.turma;
}

// Adicionar evento de clique aos botões de edição após a busca
function adiconaEventoEditar() {    
    const editButtons = document.querySelectorAll('.btnEditAluno');
    console.log('Botões de edição encontrados:', editButtons.length);

    editButtons.forEach(function(editBtn) {
        editBtn.addEventListener('click', function(event) {
            console.log("Edit button clicked");
            const row = editBtn.closest('tr');
            const aluno = {
                matricula: row.cells[0].textContent.trim(),
            };

            console.log("Matrícula do aluno:", aluno.matricula);

            fetch(`https://localhost:5000/api/Aluno/${aluno.matricula}`, {
                method: 'GET',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao obter os dados do aluno.');
                }
                return response.json();
            })
            .then(data => {
                // console.log("Dados do aluno:", data);
                fillForm(data); // Preencher o formulário com os dados recebidos
                document.getElementById('updateAlunoBtn').setAttribute('data-matricula', aluno.matricula);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    });
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
                <td>${e.matricula}</td>  
                <td>${e.nome}</td>
                <td>${date}</td>
                <td>${e.telefone}</td>
                <td>${e.email}</td>
                <td><a class="btnEditAluno" href="" data-bs-toggle="modal" data-bs-target="#formEditAluno"><box-icon name='edit'></box-icon></a></td>
                <td><a href="" data-bs-toggle="modal" data-bs-target="#apagarAluno"><box-icon type='solid' name='user-x'></box-icon></a></td>
            </tr>
            `        
        });
        content.innerHTML = contentLine
        adiconaEventoEditar()
    }      
}


buscarAlunosTodos()


//create Aluno
document.getElementById('createAlunoBtn').addEventListener('click', function() {
    function formatDate(dateStr) {
        const [day, month, year] = dateStr.split('/');
        const date = new Date(`${year}-${month}-${day}`);
        return date.toISOString();
    }

    const nome = document.getElementById('formAddNome').value;
    const cpfCnpj = document.getElementById('formAddCPF').value;
    const dataNascimento = document.getElementById('formAddDataNasc').value;
    const telefone = document.getElementById('formAddTelefone').value;
    const email = document.getElementById('formAddEmail').value;
    const endereco = document.getElementById('formAddEndereco').value;
    const curso = document.getElementById('formAddCurso').value;
    const turma = document.getElementById('formAddTurma').value;

    const aluno = {
        nome,
        cpfCnpj,
        dataNascimento: formatDate(dataNascimento),
        telefone,
        email,
        endereco,
        curso,
        turma
    };

    fetch('https://localhost:5000/api/Aluno/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(aluno)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.message || 'Erro ao cadastrar aluno.');
            });
        }
        return response.json();
    })
    .then(data => {
        const message = data.message || 'Aluno cadastrado com sucesso!';
        buscarAlunosTodos()
        showFlashMessage(message, 'success');
    })
    .catch((error) => {
        console.error('Error:', error);
        showFlashMessage(error.message, 'danger');
    });
});

function showFlashMessage(message, type) {
    const flashMessageElement = document.getElementById('flashMessage');
    flashMessageElement.textContent = message;
    flashMessageElement.className = `alert alert-${type}`;
    
    const flashModal = new bootstrap.Modal(document.getElementById('flashModal'));
    flashModal.show();
}





//editar Aluno
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente carregado e analisado');

    // Função para formatar data
    function formatDate(dateStr) {
        const [day, month, year] = dateStr.split('/');
        if (day && month && year) {
            const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
            return date.toISOString();
        } else {
            throw new Error('Data inválida');
        }
    }

    

    

    // Adicionar evento de clique ao botão de salvar
    document.getElementById('updateAlunoBtn').addEventListener('click', function() {
        const matricula = this.getAttribute('data-matricula');
        console.log(matricula)
        const aluno = {
            nome: document.getElementById('formEditNome').value,
            cpfCnpj: document.getElementById('formEditCPF').value,
            dataNascimento: formatDate(document.getElementById('formEditDataNasc').value),
            telefone: document.getElementById('formEditTelefone').value,
            email: document.getElementById('formEditEmail').value,
            endereco: document.getElementById('formEditEndereco').value,
            curso: document.getElementById('formEditCurso').value,
            turma: document.getElementById('formEditTurma').value
        };
        console.log(aluno)

        fetch(`https://localhost:5000/api/Aluno/atualizar/${matricula}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aluno)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message || 'Erro ao atualizar aluno.');
                });
            }           
        })
        .then(data => {
            const message = 'Aluno atualizado com sucesso!';
            showFlashMessage(message, 'success');
            document.querySelector('[data-bs-dismiss="modal"]').click(); // Fecha o modal de edição
            buscarAlunosTodos()
        })
        .catch((error) => {
            console.error('Error:', error);
            showFlashMessage(error.message, 'danger');
        });
    });

    // Função para mostrar mensagem flash
    function showFlashMessage(message, type) {
        const flashMessageElement = document.getElementById('flashMessage');
        flashMessageElement.textContent = message;
        flashMessageElement.className = `alert alert-${type}`;
        
        const flashModal = new bootstrap.Modal(document.getElementById('flashModal'));
        flashModal.show();
    }
});


//Buscar Aluno pelo Nome










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