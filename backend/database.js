const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Caminho absoluto do banco de dados
const caminhoBanco = path.join(__dirname, "portfolio.db");

// Conexão com o SQLite
const db = new sqlite3.Database(caminhoBanco, (erro) => {
    if (erro) {
        console.error("Erro ao conectar ao banco:", erro.message);
    } else {
        console.log("Banco de dados SQLite conectado!");
    }
});

// Executar criação das tabelas em sequência
db.serialize(() => {

    // Tabela existente: contatos
    db.run(`
        CREATE TABLE IF NOT EXISTS contatos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            telefone TEXT,
            assunto TEXT,
            mensagem TEXT NOT NULL,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (erro) => {
        if (erro) {
            console.error("Erro na tabela contatos:", erro.message);
        }
    });

    // Nova tabela: projetos
    db.run(`
        CREATE TABLE IF NOT EXISTS projetos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT NOT NULL,
            tecnologias TEXT,
            link_projeto TEXT,
            link_github TEXT,
            status TEXT NOT NULL DEFAULT 'Em desenvolvimento'
                CHECK (status IN ('Em desenvolvimento', 'Concluído')),
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (erro) => {
        if (erro) {
            console.error("Erro na tabela projetos:", erro.message);
        } else {
            console.log("Tabela projetos verificada com sucesso!");
        }
    });

});

module.exports = db;