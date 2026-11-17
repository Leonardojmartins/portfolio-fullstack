
/* ==========================================
   4ª FUNCIONALIDADE - DASHBOARD DE INDICADORES
========================================== */

const API_DASHBOARD = "http://localhost:3000/dashboard";

const mensagemDashboard = document.getElementById(
    "mensagem-dashboard"
);

const graficoTarefas = document.getElementById(
    "grafico-tarefas"
);

// Atualizar um indicador na tela
function atualizarIndicador(id, valor) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}

// Criar uma barra do gráfico
function criarBarra(titulo, quantidade, total, classe) {
    const grupo = document.createElement("div");
    grupo.className = "dashboard-grafico-item";

    const cabecalho = document.createElement("div");
    cabecalho.className = "dashboard-grafico-cabecalho";

    const nome = document.createElement("span");
    nome.textContent = titulo;

    const valor = document.createElement("strong");
    valor.textContent = quantidade;

    cabecalho.append(nome, valor);

    const trilho = document.createElement("div");
    trilho.className = "dashboard-grafico-trilho";

    const barra = document.createElement("div");
    barra.className = `dashboard-grafico-barra ${classe}`;

    const percentual = total > 0
        ? (quantidade / total) * 100
        : 0;

    barra.style.width = `${percentual}%`;

    trilho.appendChild(barra);
    grupo.append(cabecalho, trilho);

    return grupo;
}

// Montar o gráfico de distribuição
function atualizarGrafico(dados) {
    graficoTarefas.replaceChildren();

    const total = dados.total_tarefas;

    if (total === 0) {
        const aviso = document.createElement("p");

        aviso.textContent =
            "Nenhuma tarefa cadastrada para exibir no gráfico.";

        graficoTarefas.appendChild(aviso);
        return;
    }

    const indicadores = [
        {
            titulo: "Pendentes",
            quantidade: dados.tarefas_pendentes,
            classe: "barra-pendente"
        },
        {
            titulo: "Em andamento",
            quantidade: dados.tarefas_em_andamento,
            classe: "barra-andamento"
        },
        {
            titulo: "Concluídas",
            quantidade: dados.tarefas_concluidas,
            classe: "barra-concluida"
        }
    ];

    indicadores.forEach(indicador => {
        const barra = criarBarra(
            indicador.titulo,
            indicador.quantidade,
            total,
            indicador.classe
        );

        graficoTarefas.appendChild(barra);
    });
}

// Consultar os indicadores reais do SQLite
async function carregarDashboard() {
    mensagemDashboard.textContent =
        "Carregando indicadores...";

    try {
        const resposta = await fetch(API_DASHBOARD);

        if (!resposta.ok) {
            throw new Error(
                `Erro HTTP ${resposta.status}`
            );
        }

        const dados = await resposta.json();

        atualizarIndicador(
            "total-projetos",
            dados.total_projetos
        );

        atualizarIndicador(
            "projetos-desenvolvimento",
            dados.projetos_em_desenvolvimento
        );

        atualizarIndicador(
            "projetos-concluidos",
            dados.projetos_concluidos
        );

        atualizarIndicador(
            "total-tarefas",
            dados.total_tarefas
        );

        atualizarIndicador(
            "tarefas-pendentes",
            dados.tarefas_pendentes
        );

        atualizarIndicador(
            "tarefas-andamento",
            dados.tarefas_em_andamento
        );

        atualizarIndicador(
            "tarefas-concluidas",
            dados.tarefas_concluidas
        );

        atualizarGrafico(dados);

        mensagemDashboard.textContent =
            "Indicadores atualizados com sucesso.";

    } catch (erro) {
        console.error(
            "Erro ao carregar Dashboard:",
            erro
        );

        mensagemDashboard.textContent =
            "Não foi possível carregar os indicadores. " +
            "Verifique se o servidor está funcionando.";
    }
}

// Carregar ao abrir a página
carregarDashboard();
