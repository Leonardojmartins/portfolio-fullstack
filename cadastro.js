const formulario = document.getElementById("form-cadastro");
const mensagemStatus = document.getElementById("mensagem-status");

formulario.addEventListener("submit", async function (event) {

    // Impede o navegador de recarregar a página
    event.preventDefault();

    const dados = {
        nome: document.getElementById("nome").value.trim(),
        email: document.getElementById("email").value.trim(),
        telefone: document.getElementById("telefone").value.trim(),
        assunto: document.getElementById("assunto").value.trim(),
        mensagem: document.getElementById("mensagem").value.trim()
    };

    mensagemStatus.textContent = "Enviando cadastro...";

    try {

        const resposta = await fetch("http://localhost:3000/contatos", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Não foi possível realizar o cadastro.");
        }

        mensagemStatus.textContent = "Cadastro realizado com sucesso!";

        formulario.reset();

    } catch (erro) {

        console.error("Erro:", erro);

        mensagemStatus.textContent =
            "Não foi possível realizar o cadastro. Tente novamente.";
    }
});