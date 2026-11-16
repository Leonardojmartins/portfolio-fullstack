
const API_URL = "http://localhost:3000";

const formulario = document.getElementById("form-tarefa");
const campoId = document.getElementById("tarefa-id");
const campoProjeto = document.getElementById("projeto-tarefa");
const campoTitulo = document.getElementById("titulo-tarefa");
const campoDescricao = document.getElementById("descricao-tarefa");
const campoPrazo = document.getElementById("prazo-tarefa");
const campoStatus = document.getElementById("status-tarefa");

const tituloFormulario = document.getElementById("titulo-formulario");
const botaoSalvar = document.getElementById("btn-salvar");
const botaoCancelar = document.getElementById("btn-cancelar");
const mensagem = document.getElementById("mensagem-tarefa");
const statusListagem = document.getElementById("status-listagem");
const listaTarefas = document.getElementById("lista-tarefas");

let tarefas = [];

// Consultar API e tratar erros
async function consultarAPI(caminho, opcoes = {}) {
    const resposta = await fetch(`${API_URL}${caminho}`, opcoes);
    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.erro || "Erro na comunicação com a API.");
    }

    return dados;
}

// Mostrar mensagens
function mostrarMensagem(texto, erro = false) {
    mensagem.textContent = texto;
    mensagem.style.color = erro ? "#b91c1c" : "#15803d";
}

// Carregar projetos para o campo de seleção
async function carregarProjetos() {
    try {
        const projetos = await consultarAPI("/projetos");

        campoProjeto.replaceChildren();

        const inicial = document.createElement("option");
        inicial.value = "";
        inicial.textContent = "Selecione um projeto";
        campoProjeto.appendChild(inicial);

        projetos.forEach(projeto => {
            const opcao = document.createElement("option");
            opcao.value = projeto.id;
            opcao.textContent = projeto.nome;
            campoProjeto.appendChild(opcao);
        });

        if (projetos.length === 0) {
            mostrarMensagem(
                "Cadastre um projeto antes de criar tarefas.",
                true
            );
        }
    } catch (erro) {
        mostrarMensagem(
            "Não foi possível carregar os projetos: " + erro.message,
            true
        );
    }
}

// Listar tarefas
async function carregarTarefas() {
    statusListagem.textContent = "Carregando tarefas...";

    try {
        tarefas = await consultarAPI("/tarefas");
        listaTarefas.replaceChildren();

        if (tarefas.length === 0) {
            statusListagem.textContent =
                "Nenhuma tarefa cadastrada até o momento.";
            return;
        }

        statusListagem.textContent =
            `${tarefas.length} tarefa(s) cadastrada(s).`;

        tarefas.forEach(tarefa => {
            const cartao = document.createElement("article");
            cartao.className = "projeto-item";

            const titulo = document.createElement("h3");
            titulo.textContent = tarefa.titulo;

            const projeto = document.createElement("p");
            projeto.textContent = `Projeto: ${tarefa.nome_projeto}`;

            const descricao = document.createElement("p");
            descricao.textContent =
                tarefa.descricao || "Sem descrição.";

            const prazo = document.createElement("p");
            prazo.textContent = tarefa.prazo
                ? `Prazo: ${tarefa.prazo.split("-").reverse().join("/")}`
                : "Prazo: não definido";

            const status = document.createElement("p");
            status.textContent = `Status: ${tarefa.status}`;

            const acoes = document.createElement("div");
            acoes.className = "acoes-projeto";

            const editar = document.createElement("button");
            editar.type = "button";
            editar.textContent = "Editar";
            editar.addEventListener("click", () => {
                editarTarefa(tarefa.id);
            });

            const excluir = document.createElement("button");
            excluir.type = "button";
            excluir.textContent = "Excluir";
            excluir.addEventListener("click", () => {
                excluirTarefa(tarefa.id);
            });

            acoes.append(editar, excluir);
            cartao.append(
                titulo,
                projeto,
                descricao,
                prazo,
                status,
                acoes
            );

            listaTarefas.appendChild(cartao);
        });
    } catch (erro) {
        statusListagem.textContent =
            "Erro ao carregar tarefas: " + erro.message;
    }
}

// Cadastrar ou atualizar tarefa
formulario.addEventListener("submit", async evento => {
    evento.preventDefault();

    const id = campoId.value;

    const dados = {
        projeto_id: Number(campoProjeto.value),
        titulo: campoTitulo.value.trim(),
        descricao: campoDescricao.value.trim(),
        prazo: campoPrazo.value || null,
        status: campoStatus.value
    };

    const editando = Boolean(id);

    try {
        botaoSalvar.disabled = true;

        const resultado = await consultarAPI(
            editando ? `/tarefas/${id}` : "/tarefas",
            {
                method: editando ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            }
        );

        limparFormulario();
        mostrarMensagem(resultado.mensagem);
        await carregarTarefas();
    } catch (erro) {
        mostrarMensagem(erro.message, true);
    } finally {
        botaoSalvar.disabled = false;
    }
});

// Preencher formulário para edição
function editarTarefa(id) {
    const tarefa = tarefas.find(item => item.id === id);

    if (!tarefa) {
        mostrarMensagem("Tarefa não encontrada.", true);
        return;
    }

    campoId.value = tarefa.id;
    campoProjeto.value = tarefa.projeto_id;
    campoTitulo.value = tarefa.titulo;
    campoDescricao.value = tarefa.descricao || "";
    campoPrazo.value = tarefa.prazo || "";
    campoStatus.value = tarefa.status;

    tituloFormulario.textContent = "Editar tarefa";
    botaoSalvar.textContent = "Salvar alterações";
    botaoCancelar.hidden = false;

    formulario.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Excluir tarefa
async function excluirTarefa(id) {
    const tarefa = tarefas.find(item => item.id === id);

    if (!tarefa) return;

    const confirmou = window.confirm(
        `Deseja realmente excluir a tarefa "${tarefa.titulo}"?`
    );

    if (!confirmou) return;

    try {
        const resultado = await consultarAPI(
            `/tarefas/${id}`,
            { method: "DELETE" }
        );

        if (campoId.value === String(id)) {
            limparFormulario();
        }

        mostrarMensagem(resultado.mensagem);
        await carregarTarefas();
    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}

// Limpar formulário
function limparFormulario() {
    formulario.reset();
    campoId.value = "";

    tituloFormulario.textContent = "Cadastrar nova tarefa";
    botaoSalvar.textContent = "Cadastrar tarefa";
    botaoCancelar.hidden = true;
}

// Cancelar edição
botaoCancelar.addEventListener("click", () => {
    limparFormulario();
    mostrarMensagem("Edição cancelada.");
});

// Inicializar página
async function iniciar() {
    await carregarProjetos();
    await carregarTarefas();
}

iniciar();
