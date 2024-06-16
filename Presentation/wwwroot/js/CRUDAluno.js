


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
    console.log(aluno);
    document.getElementById('formEditNome').value = aluno.nome;
    document.getElementById('formEditCPF').value = aluno.cpfCnpj;
    document.getElementById('formEditDataNasc').value = formatDate(aluno.dataNascimento);
    document.getElementById('formEditTelefone').value = aluno.telefone;
    document.getElementById('formEditEmail').value = aluno.email;
    document.getElementById('formEditEndereco').value = aluno.endereco;
    // document.getElementById('formBuscarCurso').value = aluno.curso;
    // document.getElementById('formBuscarTurma').value = aluno.turma;
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
            console.log(aluno);
            // console.log("Matrícula do aluno:", aluno.matricula);

            fetch(`https://ongreciclar-2adc64114ee8.herokuapp.com/api/Aluno/${aluno.matricula}`, {
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






// Adicionar numero de matricula ao modal excluir
function addMatriculaModalExcluir() {
document.querySelectorAll('.btnDeleteAluno').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault(); // Evitar comportamento padrão do link
        console.log(this);
        const matricula = this.closest('tr').querySelector('.matricula').innerText;
        console.log("del");
        // Armazena a matrícula para uso posterior
        document.getElementById('deleteAlunoBtn').dataset.matricula = matricula;
    });
});
}


//Retorna todos os registros
async function buscarAlunosTodos() {
    const url = `https://ongreciclar-2adc64114ee8.herokuapp.com/api/Aluno/buscarTodosAlunos`; // Replace with your API URL
    const resultado = await requisicaoAPI(url, 'GET');

    if (Array.isArray(resultado)) {
        let content = document.getElementById('contentAlunos')
        let contentLine = ''
        resultado.forEach(e => {
            date = formatDate(e.dataNascimento)
            contentLine += `
            <tr >
                <td class="matricula">${e.matricula}</td>  
                <td>${e.nome}</td>
                <td>${date}</td>
                <td>${e.telefone}</td>
                <td>${e.email}</td>
                <td><a class="btnEditAluno" href="" data-bs-toggle="modal" data-bs-target="#formEditAluno"><box-icon name='edit'></box-icon></a></td>
                <td><a class="btnDeleteAluno" href="" data-bs-toggle="modal" data-bs-target="#apagarAluno"><box-icon type='solid' name='user-x'></box-icon></a></td>
            </tr>
            `        
        });
        content.innerHTML = contentLine
        adiconaEventoEditar()
        addMatriculaModalExcluir()
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
    // const curso = document.getElementById('formAddCurso').value;
    // const turma = document.getElementById('formAddTurma').value;

    const aluno = {
        nome,
        cpfCnpj,
        dataNascimento: formatDate(dataNascimento),
        telefone,
        email,
        endereco,
        // curso,
        // turma
    };

    fetch('https://ongreciclar-2adc64114ee8.herokuapp.com/api/Aluno/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(aluno)
    })
    .then(response => {
        if (!response.ok) {
            console.log(response)
            return response.text().then(error => {
                throw new Error(error || 'Erro ao cadastrar aluno.');
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





//Editar e Excluir Alunos
document.addEventListener('DOMContentLoaded', function() {
    // console.log('DOM completamente carregado e analisado');

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

    

    
    //Editar Aluno
    // Adicionar evento de clique ao botão de salvar 
    function updateAluno() {
    
    document.getElementById('updateAlunoBtn').addEventListener('click', function() {
        const matricula = this.getAttribute('data-matricula');
        const aluno = {
            nome: document.getElementById('formEditNome').value,
            cpfCnpj: document.getElementById('formEditCPF').value,
            dataNascimento: formatDate(document.getElementById('formEditDataNasc').value),
            telefone: document.getElementById('formEditTelefone').value,
            email: document.getElementById('formEditEmail').value,
            endereco: document.getElementById('formEditEndereco').value,
            // curso: document.getElementById('formEditCurso').value,
            // turma: document.getElementById('formEditTurma').value
        };
        // console.log(aluno)

        fetch(`https://ongreciclar-2adc64114ee8.herokuapp.com/api/Aluno/atualizar/${matricula}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aluno)
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(error => {
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
}

updateAluno()

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

// Função para deletar aluno
function deleteAluno(matricula) {
    fetch(`https://ongreciclar-2adc64114ee8.herokuapp.com/api/Aluno/remover/${matricula}`, {
        method: 'DELETE'
    })
    .then(response => {
        return response.text().then(text => {
            try {
                return JSON.parse(text);
            } catch (err) {
                return text;
            }
        }).then(data => {
            if (!response.ok) {
                throw new Error(data.message || data || 'Erro ao apagar aluno.');
            }
            return data;
        });
    })
    .then(data => {
        const message = data.message || 'Aluno apagado com sucesso!';
        buscarAlunosTodos(); // Atualizar a lista de alunos
        showFlashMessage(message, 'success');
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('apagarAluno'));
        modal.hide();
    })
    .catch((error) => {
        console.error('Error:', error);
        showFlashMessage(error.message || 'Erro ao apagar aluno.', 'danger');
    });
}



// Adicionar evento ao botão de confirmação de exclusão no modal
document.getElementById('deleteAlunoBtn').addEventListener('click', function() {    
    const matricula = this.dataset.matricula;
    console.log(this);
    deleteAluno(matricula);
});



let alunos = []; // Array para armazenar os resultados da busca
let currentIndex = 0; // Índice do aluno atual a ser exibido



// Função para preencher o modal com os dados do aluno
function preencherModalAluno(aluno) {
    document.getElementById('formBuscarNome').value = aluno.nome || '';
    document.getElementById('formBuscarCPF').value = aluno.cpfCnpj || '';
    document.getElementById('formBuscarDataNasc').value = aluno.dataNascimento || '';
    document.getElementById('formBuscarTelefone').value = aluno.telefone || '';
    document.getElementById('formBuscarEmail').value = aluno.email || '';
    document.getElementById('formBuscarEndereco').value = aluno.endereco || '';
}

// Função para exibir mensagens de feedback
function showSmallMessage(message, type) {
    const flashMessageDiv = document.getElementById('flashSmallMessage');
    flashMessageDiv.innerHTML = ''; // Limpar mensagem anterior

    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.color = 'red';
    // Aplicar estilo conforme o tipo da mensagem
    

    flashMessageDiv.appendChild(messageElement);

    // Ocultar a mensagem após alguns segundos (opcional)
    setTimeout(() => {
        flashMessageDiv.innerHTML = '';
    }, 5000);
}



// Função para buscar aluno por nome
function buscarAlunoPorNome(nome) {
    fetch(`https://ongreciclar-2adc64114ee8.herokuapp.com/api/Aluno/buscar/${nome}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                alunos = data;
                currentIndex = 0;
                
                preencherModalAluno(alunos[currentIndex]);
                // Abrir o modal
                const modal = new bootstrap.Modal(document.getElementById('formBuscarAluno'));
                modal.show();
                
            } else {
                showSmallMessage('Aluno não encontrado.', 'warning');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showSmallMessage('Erro ao buscar aluno.', 'danger');
        });
}




// Função para mostrar o próximo aluno
function showNextAluno() {
    if (currentIndex < alunos.length - 1) {
        currentIndex++;
        preencherModalAluno(alunos[currentIndex]);
    }
}

// Função para mostrar o aluno anterior
function showPreviousAluno() {
    if (currentIndex > 0) {
        currentIndex--;
        preencherModalAluno(alunos[currentIndex]);
    }
}

// Capturar o evento de submissão do formulário de busca
document.getElementById('searchAlunoForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir o comportamento padrão do formulário
    const nome = document.getElementById('searchAlunoInput').value;
    if (nome) {
        buscarAlunoPorNome(nome);
    } else {
        showSmallMessage('Por favor, insira um nome para buscar.', 'warning');
    }
});

// Adicionar event listeners para os botões de navegação
document.getElementById('nextAlunoBtn').addEventListener('click', showNextAluno);
document.getElementById('previousAlunoBtn').addEventListener('click', showPreviousAluno);

