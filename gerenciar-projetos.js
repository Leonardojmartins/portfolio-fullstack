
const API_URL = "http://localhost:3000";

const listaProjetos = document.getElementById("lista-projetos");
const statusListagem = document.getElementById("status-listagem");

// Buscar projetos cadastrados no SQLite
async function carregarProjetos() {
    statusListagem.textContent = "Carregando projetos...";
    listaProjetos.replaceChildren();

    try {
        const resposta = await fetch(`${API_URL}/projetos`);

        if (!resposta.ok) {
            throw new Error("Falha ao consultar projetos.");
        }

        const projetos = await resposta.json();

        if (!Array.isArray(projetos)) {
            throw new Error("Resposta inválida da API.");
        }

        if (projetos.length === 0) {
            statusListagem.textContent =
                "Nenhum projeto cadastrado no momento.";
            return;
        }

        statusListagem.textContent =
            `${projetos.length} projeto(s) cadastrado(s).`;

        projetos.forEach((projeto) => {
            const card = document.createElement("article");
            card.className = "card-projeto";

            const titulo = document.createElement("h3");
            titulo.textContent = projeto.nome;

            const descricao = document.createElement("p");
            descricao.textContent = projeto.descricao;

            const tecnologias = document.createElement("p");
            tecnologias.textContent =
                `Tecnologias: ${projeto.tecnologias || "Não informado"}`;

            const status = document.createElement("p");
            status.textContent = `Status: ${projeto.status}`;

            // Criar botão Editar
const botaoEditar = document.createElement("button");

botaoEditar.type = "button";
botaoEditar.textContent = "Editar";
botaoEditar.className = "btn-editar-projeto";

// Ao clicar, carregar os dados no formulário
botaoEditar.addEventListener("click", () => {
    prepararEdicao(projeto);
});

// Criar botão Excluir
const botaoExcluir = document.createElement("button");

botaoExcluir.type = "button";
botaoExcluir.textContent = "Excluir";
botaoExcluir.className = "btn-excluir-projeto";

botaoExcluir.addEventListener("click", () => {
    excluirProjeto(projeto);
});

// Adicionar os elementos ao card
card.append(
    titulo,
    descricao,
    tecnologias,
    status,
    botaoEditar,
    botaoExcluir
);
listaProjetos.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao carregar projetos:", erro);

        statusListagem.textContent =
            "Não foi possível carregar os projetos. Verifique o servidor.";
    }
}

// Executar a consulta ao abrir a página
carregarProjetos();


/* ==========================================
   CADASTRAR PROJETO PELO FORMULÁRIO
========================================== */

const formularioProjeto = document.getElementById("form-projeto");
const mensagemProjeto = document.getElementById("mensagem-projeto");
const botaoSalvar = document.getElementById("btn-salvar");

formularioProjeto.addEventListener("submit", async (event) => {
    event.preventDefault();

    const dados = {
        nome: document.getElementById("nome-projeto").value.trim(),
        descricao: document.getElementById("descricao-projeto").value.trim(),
        tecnologias: document.getElementById("tecnologias-projeto").value.trim(),
        link_projeto: document.getElementById("link-projeto").value.trim(),
        link_github: document.getElementById("link-github").value.trim(),
        status: document.getElementById("status-projeto").value
    };

    if (!dados.nome || !dados.descricao) {
        mensagemProjeto.textContent =
            "Preencha o nome e a descrição do projeto.";
        return;
    }

    botaoSalvar.disabled = true;
    mensagemProjeto.textContent = "Salvando projeto...";

    try {
        // Verificar se estamos cadastrando ou editando
const projetoId = document.getElementById("projeto-id").value;

const editando = projetoId !== "";

const url = editando
    ? `${API_URL}/projetos/${projetoId}`
    : `${API_URL}/projetos`;

const resposta = await fetch(url, {
    method: editando ? "PUT" : "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
});

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                resultado.erro || "Erro ao cadastrar projeto."
            );
        }

       mensagemProjeto.textContent = editando
    ? "Projeto atualizado com sucesso!"
    : "Projeto cadastrado com sucesso!";

formularioProjeto.reset();

// Limpar o ID do projeto após salvar
document.getElementById("projeto-id").value = "";

// Restaurar o formulário para o modo cadastro
document.getElementById("titulo-formulario").textContent =
    "Cadastrar novo projeto";

botaoSalvar.textContent = "Cadastrar projeto";

document.getElementById("btn-cancelar").hidden = true;

        await carregarProjetos();

    } catch (erro) {
        console.error("Erro ao cadastrar projeto:", erro);

        mensagemProjeto.textContent =
            erro.message || "Não foi possível cadastrar o projeto.";
    } finally {
        botaoSalvar.disabled = false;
    }
});
// ==========================================
// PREPARAR EDIÇÃO DO PROJETO
// ==========================================

function prepararEdicao(projeto) {

    document.getElementById("projeto-id").value = projeto.id;

    document.getElementById("nome-projeto").value =
        projeto.nome;

    document.getElementById("descricao-projeto").value =
        projeto.descricao;

    document.getElementById("tecnologias-projeto").value =
        projeto.tecnologias || "";

    document.getElementById("link-projeto").value =
        projeto.link_projeto || "";

    document.getElementById("link-github").value =
        projeto.link_github || "";

    document.getElementById("status-projeto").value =
        projeto.status;

    document.getElementById("titulo-formulario").textContent =
        "Editar projeto";

    document.getElementById("btn-salvar").textContent =
        "Salvar alterações";

    document.getElementById("btn-cancelar").hidden = false;

    document.getElementById("mensagem-projeto").textContent = "";

    document.querySelector(".projeto-formulario")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
}
// ==========================================
// CANCELAR EDIÇÃO
// ==========================================

const botaoCancelar = document.getElementById("btn-cancelar");

botaoCancelar.addEventListener("click", () => {

    // Limpar os campos do formulário
    formularioProjeto.reset();

    // Remover o ID do projeto em edição
    document.getElementById("projeto-id").value = "";

    // Restaurar título e botão
    document.getElementById("titulo-formulario").textContent =
        "Cadastrar novo projeto";

    botaoSalvar.textContent = "Cadastrar projeto";

    // Ocultar botão Cancelar
    botaoCancelar.hidden = true;

    // Limpar mensagem anterior
    mensagemProjeto.textContent = "";
});
// ==========================================
// EXCLUIR PROJETO
// ==========================================

async function excluirProjeto(projeto) {

    const confirmar = window.confirm(
        `Deseja realmente excluir o projeto "${projeto.nome}"?\n\nEsta ação não poderá ser desfeita.`
    );

    if (!confirmar) {
        return;
    }

    const id = Number(projeto.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        mensagemProjeto.textContent = "ID do projeto inválido.";
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/projetos/${id}`, {
            method: "DELETE"
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                resultado.erro || "Erro ao excluir projeto."
            );
        }

        // Se o projeto excluído estava sendo editado,
        // restaurar o formulário.
        const idEmEdicao =
            document.getElementById("projeto-id").value;

        if (idEmEdicao === String(id)) {
            formularioProjeto.reset();

            document.getElementById("projeto-id").value = "";

            document.getElementById("titulo-formulario").textContent =
                "Cadastrar novo projeto";

            botaoSalvar.textContent = "Cadastrar projeto";

            document.getElementById("btn-cancelar").hidden = true;
        }

        mensagemProjeto.textContent =
            "Projeto excluído com sucesso!";

        await carregarProjetos();

    } catch (erro) {
        console.error("Erro ao excluir projeto:", erro);

        mensagemProjeto.textContent =
            erro.message || "Não foi possível excluir o projeto.";
    }
}