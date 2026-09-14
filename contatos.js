const listaContatos = document.getElementById("lista-contatos");
const statusConsulta = document.getElementById("status-consulta");

async function carregarContatos() {

    try {

        const resposta = await fetch("http://localhost:3000/contatos");

        if (!resposta.ok) {
            throw new Error("Não foi possível consultar os cadastros.");
        }

        const contatos = await resposta.json();

        listaContatos.innerHTML = "";

        if (contatos.length === 0) {
            statusConsulta.textContent =
                "Nenhum cadastro encontrado no banco de dados.";

            return;
        }

        statusConsulta.textContent =
            `${contatos.length} cadastro(s) encontrado(s).`;

        contatos.forEach(contato => {

            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${contato.id}</td>
                <td>${contato.nome}</td>
                <td>${contato.email}</td>
                <td>${contato.telefone || "-"}</td>
                <td>${contato.assunto || "-"}</td>
                <td>${contato.mensagem}</td>
                <td>${contato.criado_em}</td>
            `;

            listaContatos.appendChild(linha);
        });

    } catch (erro) {

        console.error(erro);

        statusConsulta.textContent =
            "Não foi possível carregar os cadastros. Verifique se o backend está funcionando.";
    }
}

carregarContatos();