// ==========================
// animes.js
// Anteriormente responsável por buscar e exibir animes de uma API externa (Jikan API).
// Modificado para remover a funcionalidade de adicionar animes da API ao grid,
// focando na exibição de animes com vídeos controlada por home.js.
// ==========================

// Variável global para controle do timeout da mensagem
let timeoutMensagem;

/**
 * Exibe uma mensagem de feedback na tela.
 * @param {string} texto - O texto da mensagem a ser exibida.
 * @param {boolean} sucesso - true para mensagem de sucesso (fundo verde), false para erro (fundo vermelho).
 */
function mostrarMensagem(texto, sucesso = true) {
    const msg = document.getElementById("mensagem-sucesso");

    clearTimeout(timeoutMensagem); // Limpa qualquer timeout anterior para evitar sobreposição
    msg.textContent = texto; // Define o texto da mensagem
    // Define a cor de fundo com base no tipo de mensagem (sucesso/erro)
    msg.style.backgroundColor = sucesso ? "#00c853" : "#e53935";

    // Remove a classe de ocultação e força o reflow para aplicar a transição de opacidade
    msg.classList.remove("mensagem-oculta");
    msg.style.opacity = "0";
    void msg.offsetWidth; // Gatilho de reflow
    msg.style.opacity = "1"; // Torna a mensagem visível

    // Define um timeout para ocultar a mensagem após 3 segundos
    timeoutMensagem = setTimeout(() => {
        msg.style.opacity = "0"; // Inicia a transição para ocultar
        // Após a transição, adiciona a classe de ocultação novamente
        setTimeout(() => {
            msg.classList.add("mensagem-oculta");
        }, 300); // Deve corresponder à duração da transição CSS
    }, 3000);
}

// O bloco de código que buscava e adicionava animes da Jikan API foi removido.
// Isso evita que animes da API externa sejam adicionados ao DOM,
// garantindo que apenas os animes com vídeos (do home.js) sejam exibidos.
/*
document.addEventListener("DOMContentLoaded", async () => {
    const grid = document.querySelector(".grid");

    try {
        const resposta = await fetch("https://api.jikan.moe/v4/top/anime?limit=12");
        const dados = await resposta.json();
        const animes = dados.data;

        animes.forEach(anime => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                <p><strong>${anime.title}</strong></p>
                <p>Nota: ⭐ ${anime.score || "N/A"}</p>
                <button class="favoritar" data-id="${anime.mal_id}" data-title="${anime.title}">
                    ❤️ Favoritar
                </button>
            `;

            grid.appendChild(card);
        });

        // Este listener de clique para favoritos também foi modificado ou removido
        // se a intenção é gerenciar favoritos apenas via home.js
        grid.addEventListener("click", async (event) => {
            if (event.target.classList.contains("favoritar")) {
                const animeId = event.target.dataset.id;
                const animeTitulo = event.target.dataset.title;
                const token = localStorage.getItem("token");

                try {
                    const resposta = await fetch("http://localhost:5000/api/favoritos", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token
                        },
                        body: JSON.stringify({ animeId, titulo: animeTitulo })
                    });

                    if (resposta.ok) {
                        mostrarMensagem(`❤️ ${animeTitulo} adicionado aos favoritos!`, true);
                    } else {
                        let mensagemErro = "Erro ao favoritar";
                        try {
                            const erro = await resposta.json();
                            if (erro.mensagem) mensagemErro = erro.mensagem;
                        } catch {}
                        mostrarMensagem(mensagemErro, false);
                    }

                } catch {
                    mostrarMensagem("Erro de conexão com o servidor", false);
                }
            }
        });

    } catch {
        grid.innerHTML = "<p>Erro ao carregar animes. Tente novamente mais tarde.</p>";
    }
});
*/
