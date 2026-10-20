# Portfólio - Leonardo Martins

Portfólio acadêmico desenvolvido para apresentação de projetos e demonstração de conhecimentos em desenvolvimento web.

Além da interface Front-End, o projeto possui uma funcionalidade de cadastro integrada a uma API Back-End e banco de dados.

## Tecnologias utilizadas

### Front-End
- HTML5
- CSS3
- JavaScript

### Back-End
- Node.js
- Express.js
- CORS

### Banco de Dados
- SQLite

## Funcionalidades

- Página inicial responsiva
- Apresentação de projetos
- Links para projetos publicados
- Formulário de cadastro
- Validação de campos obrigatórios
- Comunicação entre Front-End e Back-End
- Persistência dos cadastros em banco SQLite
- Consulta dos registros armazenados

## Estrutura do projeto

```text
Portfolio2/
├── backend/
│   ├── database.js
│   ├── portfolio.db
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── css/
│   └── estilo.css
├── img/
├── cadastro.html
├── cadastro.js
├── contatos.html
├── contatos.js
├── index.html
├── .gitignore
└── README.md
```

## Como executar o projeto

É necessário possuir o Node.js instalado.

### 1. Clone ou baixe este repositório

Depois, abra a pasta do projeto no VS Code.

### 2. Acesse a pasta do Back-End

```bash
cd backend
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o servidor

```bash
node server.js
```

O Back-End ficará disponível em:

```text
http://localhost:3000
```

### 5. Execute o Front-End

Abra o `index.html` utilizando a extensão Live Server do VS Code.

Normalmente o endereço será:

```text
http://127.0.0.1:5500/index.html
```

## Testando o cadastro

No menu principal, selecione **Cadastro**.

Preencha o formulário e clique em **Cadastrar**.

Os dados serão enviados para:

```text
POST http://localhost:3000/contatos
```

e armazenados no banco SQLite.

## Consultando os registros

Para visualizar os registros através da interface:

```text
http://127.0.0.1:5500/contatos.html
```

Também é possível consultar diretamente a API:

```text
GET http://localhost:3000/contatos
```

## Fluxo da aplicação

```text
HTML/CSS
   ↓
JavaScript
   ↓
Fetch API
   ↓
Node.js + Express
   ↓
SQLite
   ↓
portfolio.db
```

## Objetivo acadêmico

O objetivo deste projeto é demonstrar conhecimentos básicos de desenvolvimento Full Stack, contemplando interface Front-End, API Back-End e persistência de dados.

## Autor

Leonardo Martins



---

## Segunda funcionalidade — Gerenciamento de Projetos

Foi implementado um módulo de gerenciamento de projetos, integrado ao portfólio existente.

### Tecnologias

- Frontend: HTML5, CSS3 e JavaScript
- Backend: Node.js e Express
- Banco de dados: SQLite

### Funcionalidades

- Cadastrar novos projetos
- Consultar projetos cadastrados
- Editar informações e status dos projetos
- Cancelar uma edição
- Excluir projetos mediante confirmação
- Persistir os dados no SQLite

### Operações CRUD

| Operação | Método HTTP | Endpoint | SQL |
|---|---|---|---|
| Cadastrar | POST | /projetos | INSERT |
| Consultar | GET | /projetos | SELECT |
| Atualizar | PUT | /projetos/:id | UPDATE |
| Excluir | DELETE | /projetos/:id | DELETE |

### Como executar

1. Abra o projeto no VS Code.
2. Entre na pasta backend.
3. Instale as dependências com `npm install`, se necessário.
4. Inicie o servidor com `node server.js`.
5. Abra `index.html` utilizando o Live Server.
6. Clique em **Gerenciar Projetos** no menu principal.

O backend utiliza a porta 3000 e o Live Server normalmente utiliza a porta 5500.

### Persistência

Os projetos são armazenados na tabela `projetos` do banco SQLite `backend/portfolio.db`.

As operações são executadas por meio de uma API REST desenvolvida com Express.

### Observação de segurança

O módulo foi desenvolvido para demonstração acadêmica em ambiente local. As operações administrativas não possuem autenticação e não devem ser disponibilizadas publicamente sem controle de acesso.
