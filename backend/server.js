const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensagem: "Backend do Portfolio funcionando!"
    });
});

// Cadastrar contato
app.post("/contatos", (req, res) => {
    const { nome, email, telefone, assunto, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
        return res.status(400).json({
            erro: "Nome, e-mail e mensagem são obrigatórios."
        });
    }

    const sql = `
        INSERT INTO contatos (nome, email, telefone, assunto, mensagem)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [nome, email, telefone, assunto, mensagem],
        function (erro) {
            if (erro) {
                console.error("Erro ao cadastrar contato:", erro.message);

                return res.status(500).json({
                    erro: "Erro ao salvar contato."
                });
            }

            res.status(201).json({
                mensagem: "Contato cadastrado com sucesso!",
                id: this.lastID
            });
        }
    );
});

// Listar contatos
app.get("/contatos", (req, res) => {
    const sql = "SELECT * FROM contatos ORDER BY criado_em DESC";

    db.all(sql, [], (erro, linhas) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao buscar contatos."
            });
        }

        res.json(linhas);
    });
});


// ==========================================
// CADASTRAR PROJETO - POST /projetos
// ==========================================

app.post("/projetos", (req, res) => {

    const {
        nome,
        descricao,
        tecnologias,
        link_projeto,
        link_github,
        status
    } = req.body || {};

    // Validar campos obrigatórios
    if (
        typeof nome !== "string" ||
        !nome.trim() ||
        typeof descricao !== "string" ||
        !descricao.trim()
    ) {
        return res.status(400).json({
            erro: "Nome e descrição são obrigatórios."
        });
    }

    // Validar campos opcionais
    const opcionais = {
        tecnologias,
        link_projeto,
        link_github
    };

    for (const [campo, valor] of Object.entries(opcionais)) {
        if (valor !== undefined && valor !== null && typeof valor !== "string") {
            return res.status(400).json({
                erro: `O campo ${campo} deve ser um texto.`
            });
        }
    }

    // Definir e validar status
    const statusProjeto = status === undefined
        ? "Em desenvolvimento"
        : status;

    if (!["Em desenvolvimento", "Concluído"].includes(statusProjeto)) {
        return res.status(400).json({
            erro: "Status inválido."
        });
    }

    const sql = `
        INSERT INTO projetos
        (nome, descricao, tecnologias, link_projeto, link_github, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        nome.trim(),
        descricao.trim(),
        tecnologias?.trim() || null,
        link_projeto?.trim() || null,
        link_github?.trim() || null,
        statusProjeto
    ];

    db.run(sql, valores, function (erro) {

        if (erro) {
            console.error("Erro ao cadastrar projeto:", erro.message);

            return res.status(500).json({
                erro: "Erro ao salvar projeto no banco de dados."
            });
        }

        return res.status(201).json({
            mensagem: "Projeto cadastrado com sucesso!",
            id: this.lastID
        });

    });

});

// ==========================================
// LISTAR PROJETOS - GET /projetos
// ==========================================

app.get("/projetos", (req, res) => {

    const sql = `
        SELECT *
        FROM projetos
        ORDER BY id DESC
    `;

    db.all(sql, [], (erro, projetos) => {

        if (erro) {
            console.error("Erro ao buscar projetos:", erro.message);

            return res.status(500).json({
                erro: "Erro ao consultar projetos."
            });
        }

        return res.status(200).json(projetos);

    });

});
// ==========================================
// ATUALIZAR PROJETO - PUT /projetos/:id
// ==========================================

app.put("/projetos/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
            erro: "ID do projeto inválido."
        });
    }

    const {
        nome,
        descricao,
        tecnologias,
        link_projeto,
        link_github,
        status
    } = req.body || {};

    if (
        typeof nome !== "string" || !nome.trim() ||
        typeof descricao !== "string" || !descricao.trim()
    ) {
        return res.status(400).json({
            erro: "Nome e descrição são obrigatórios."
        });
    }

    for (const valor of [tecnologias, link_projeto, link_github]) {
        if (valor != null && typeof valor !== "string") {
            return res.status(400).json({
                erro: "Os campos opcionais devem ser textos."
            });
        }
    }

    if (!["Em desenvolvimento", "Concluído"].includes(status)) {
        return res.status(400).json({
            erro: "Status inválido."
        });
    }

    const sql = `
        UPDATE projetos
        SET nome = ?, descricao = ?, tecnologias = ?,
            link_projeto = ?, link_github = ?, status = ?
        WHERE id = ?
    `;

    db.run(sql, [
        nome.trim(),
        descricao.trim(),
        tecnologias?.trim() || null,
        link_projeto?.trim() || null,
        link_github?.trim() || null,
        status,
        id
    ], function (erro) {
        if (erro) {
            console.error("Erro ao atualizar projeto:", erro.message);
            return res.status(500).json({
                erro: "Erro ao atualizar projeto."
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                erro: "Projeto não encontrado."
            });
        }

        return res.json({
            mensagem: "Projeto atualizado com sucesso!",
            id
        });
    });
});

// ==========================================
// EXCLUIR PROJETO - DELETE /projetos/:id
// ==========================================

app.delete("/projetos/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
            erro: "ID do projeto inválido."
        });
    }

    const sql = "DELETE FROM projetos WHERE id = ?";

    db.run(sql, [id], function (erro) {
        if (erro) {
            console.error("Erro ao excluir projeto:", erro.message);

            return res.status(500).json({
                erro: "Erro ao excluir projeto."
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                erro: "Projeto não encontrado."
            });
        }

        return res.status(200).json({
            mensagem: "Projeto excluído com sucesso!",
            id
        });
    });
});

/* ==========================================
   3ª FUNCIONALIDADE - GERENCIAMENTO DE TAREFAS
========================================== */

// Status permitidos
const statusTarefas = [
    "Pendente",
    "Em andamento",
    "Concluída"
];

// Validar identificadores positivos
function validarIdTarefa(valor) {
    if (
        typeof valor !== "string" &&
        typeof valor !== "number"
    ) {
        return null;
    }

    if (String(valor).trim() === "") {
        return null;
    }

    const id = Number(valor);

    return Number.isSafeInteger(id) && id > 0
        ? id
        : null;
}

// Validar datas no formato AAAA-MM-DD
function validarPrazoTarefa(prazo) {
    if (prazo === null || prazo === undefined || prazo === "") {
        return true;
    }

    if (typeof prazo !== "string") {
        return false;
    }

    const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(prazo);

    if (!partes) {
        return false;
    }

    const ano = Number(partes[1]);
    const mes = Number(partes[2]);
    const dia = Number(partes[3]);

    if (ano < 1 || ano > 9999 || mes < 1 || mes > 12) {
        return false;
    }

    const bissexto =
        ano % 4 === 0 &&
        (ano % 100 !== 0 || ano % 400 === 0);

    const diasPorMes = [
        31, bissexto ? 29 : 28, 31, 30, 31,
        30, 31, 31, 30, 31, 30, 31
    ];

    return dia >= 1 && dia <= diasPorMes[mes - 1];
}

// Validar dados recebidos
function validarDadosTarefa(dados) {
    const {
        projeto_id,
        titulo,
        descricao,
        prazo,
        status
    } = dados || {};

    const projetoId = validarIdTarefa(projeto_id);

    if (!projetoId) {
        return { erro: "Selecione um projeto válido." };
    }

    if (typeof titulo !== "string" || !titulo.trim()) {
        return { erro: "O título da tarefa é obrigatório." };
    }

    if (descricao != null && typeof descricao !== "string") {
        return { erro: "A descrição deve ser um texto." };
    }

    if (!validarPrazoTarefa(prazo)) {
        return {
            erro: "Informe uma data válida no formato AAAA-MM-DD."
        };
    }

    const statusFinal = status === undefined
        ? "Pendente"
        : status;

    if (!statusTarefas.includes(statusFinal)) {
        return { erro: "Status da tarefa inválido." };
    }

    return {
        valores: [
            projetoId,
            titulo.trim(),
            descricao?.trim() || null,
            prazo || null,
            statusFinal
        ]
    };
}

// ==========================================
// CONSULTAR TAREFAS - GET /tarefas
// ==========================================

app.get("/tarefas", (req, res) => {
    const sql = `
        SELECT
            t.*,
            p.nome AS nome_projeto
        FROM tarefas t
        INNER JOIN projetos p
            ON p.id = t.projeto_id
        ORDER BY t.id DESC
    `;

    db.all(sql, [], (erro, tarefas) => {
        if (erro) {
            console.error("Erro ao consultar tarefas:", erro.message);

            return res.status(500).json({
                erro: "Erro ao consultar tarefas."
            });
        }

        return res.status(200).json(tarefas);
    });
});

// ==========================================
// CADASTRAR TAREFA - POST /tarefas
// ==========================================

app.post("/tarefas", (req, res) => {
    const validacao = validarDadosTarefa(req.body);

    if (validacao.erro) {
        return res.status(400).json({
            erro: validacao.erro
        });
    }

    const sql = `
        INSERT INTO tarefas
            (projeto_id, titulo, descricao, prazo, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, validacao.valores, function (erro) {
        if (erro) {
            if (erro.code === "SQLITE_CONSTRAINT") {
                return res.status(400).json({
                    erro: "Projeto inexistente ou dados inválidos."
                });
            }

            console.error("Erro ao cadastrar tarefa:", erro.message);

            return res.status(500).json({
                erro: "Erro ao cadastrar tarefa."
            });
        }

        return res.status(201).json({
            mensagem: "Tarefa cadastrada com sucesso!",
            id: this.lastID
        });
    });
});

// ==========================================
// ATUALIZAR TAREFA - PUT /tarefas/:id
// ==========================================

app.put("/tarefas/:id", (req, res) => {
    const id = validarIdTarefa(req.params.id);

    if (!id) {
        return res.status(400).json({
            erro: "ID da tarefa inválido."
        });
    }

    const validacao = validarDadosTarefa(req.body);

    if (validacao.erro) {
        return res.status(400).json({
            erro: validacao.erro
        });
    }

    const sql = `
        UPDATE tarefas
        SET projeto_id = ?,
            titulo = ?,
            descricao = ?,
            prazo = ?,
            status = ?
        WHERE id = ?
    `;

    db.run(
        sql,
        [...validacao.valores, id],
        function (erro) {
            if (erro) {
                if (erro.code === "SQLITE_CONSTRAINT") {
                    return res.status(400).json({
                        erro: "Projeto inexistente ou dados inválidos."
                    });
                }

                console.error("Erro ao atualizar tarefa:", erro.message);

                return res.status(500).json({
                    erro: "Erro ao atualizar tarefa."
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    erro: "Tarefa não encontrada."
                });
            }

            return res.status(200).json({
                mensagem: "Tarefa atualizada com sucesso!",
                id
            });
        }
    );
});

// ==========================================
// EXCLUIR TAREFA - DELETE /tarefas/:id
// ==========================================

app.delete("/tarefas/:id", (req, res) => {
    const id = validarIdTarefa(req.params.id);

    if (!id) {
        return res.status(400).json({
            erro: "ID da tarefa inválido."
        });
    }

    db.run(
        "DELETE FROM tarefas WHERE id = ?",
        [id],
        function (erro) {
            if (erro) {
                console.error("Erro ao excluir tarefa:", erro.message);

                return res.status(500).json({
                    erro: "Erro ao excluir tarefa."
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    erro: "Tarefa não encontrada."
                });
            }

            return res.status(200).json({
                mensagem: "Tarefa excluída com sucesso!",
                id
            });
        }
    );
});

/* ==========================================
   4ª FUNCIONALIDADE - DASHBOARD DE INDICADORES
========================================== */

app.get("/dashboard", (req, res) => {

    const sql = `
        SELECT
            (SELECT COUNT(*) FROM projetos)
                AS total_projetos,

            (SELECT COUNT(*) FROM projetos
             WHERE status = 'Em desenvolvimento')
                AS projetos_em_desenvolvimento,

            (SELECT COUNT(*) FROM projetos
             WHERE status = 'Concluído')
                AS projetos_concluidos,

            (SELECT COUNT(*) FROM tarefas)
                AS total_tarefas,

            (SELECT COUNT(*) FROM tarefas
             WHERE status = 'Pendente')
                AS tarefas_pendentes,

            (SELECT COUNT(*) FROM tarefas
             WHERE status = 'Em andamento')
                AS tarefas_em_andamento,

            (SELECT COUNT(*) FROM tarefas
             WHERE status = 'Concluída')
                AS tarefas_concluidas
    `;

    db.get(sql, [], (erro, indicadores) => {

        if (erro) {
            console.error(
                "Erro ao consultar Dashboard:",
                erro.message
            );

            return res.status(500).json({
                erro: "Erro ao carregar indicadores."
            });
        }

        return res.status(200).json(indicadores);
    });
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});