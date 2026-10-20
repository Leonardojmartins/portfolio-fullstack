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

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});