const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./portfolio.db", (erro) => {
    if (erro) {
        console.error("Erro ao conectar ao banco:", erro.message);
    } else {
        console.log("Banco de dados SQLite conectado!");
    }
});

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
`);

module.exports = db;