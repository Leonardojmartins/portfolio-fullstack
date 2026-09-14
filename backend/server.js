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

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});