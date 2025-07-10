// ==========================
// favoritos.js
// Gerencia a exibição e remoção de animes favoritos do usuário.
// Agora exibe a imagem de capa e um botão para assistir ao vídeo,
// utilizando os dados armazenados no próprio backend (imagem, video).
// Implementa reprodução de vídeo em um modal.
// ==========================

// Variável global para controle do timeout da mensagem de feedback
let timeoutMensagem;

/**
 * Exibe uma mensagem de feedback na tela (sucesso ou erro).
 * Esta função é reutilizada de outros arquivos JavaScript.
 * @param {string} texto - O texto da mensagem a ser exibida.
 * @param {boolean} sucesso - true para mensagem de sucesso (fundo verde), false para erro (fundo vermelho).
 */
function mostrarMensagem(texto, sucesso = true) {
    const msg = document.getElementById("mensagem-sucesso");

    clearTimeout(timeoutMensagem); // Limpa qualquer timeout anterior
    msg.textContent = texto; // Define o texto
    msg.style.backgroundColor = sucesso ? "#00c853" : "#e53935"; // Define a cor de fundo

    msg.classList.remove("mensagem-oculta"); // Torna visível
    msg.style.opacity = "0";
    void msg.offsetWidth; // Força o reflow para a transição
    msg.style.opacity = "1";

    timeoutMensagem = setTimeout(() => {
        msg.style.opacity = "0";
        setTimeout(() => {
            msg.classList.add("mensagem-oculta");
        }, 300); // Esconde após a transição
    }, 3000); // Mensagem visível por 3 segundos
}

document.addEventListener("DOMContentLoaded", async () => {
    // Obtém o token de autenticação do localStorage
    const token = localStorage.getItem("token");
    // Seleciona a grade onde os favoritos serão exibidos
    const grid = document.querySelector("#favoritos-grid");

    // Elementos do Modal de Vídeo
    const videoModal = document.getElementById('video-modal');
    const modalVideoPlayer = document.getElementById('modal-video-player');
    const fecharModalBtn = document.querySelector('.fechar-modal');

    // Redireciona para a página de login se o usuário não estiver logado
    if (!token) {
        mostrarMensagem("Você precisa estar logado para ver seus favoritos.", false);
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
        return;
    }

    // 🔊 Listener para cliques nos botões dos cards de favoritos (Remover e Assistir)
    grid.addEventListener("click", async (event) => {
        // Lógica para remover favorito
        if (event.target.classList.contains("remover")) {
            const animeId = event.target.dataset.id;

            console.log("🧪 Clique detectado para remover:", animeId);

            // Confirmação para remover (substitua por um modal customizado para melhor UX)
            if (!window.confirm("Tem certeza que deseja remover este anime dos favoritos?")) {
                return;
            }

            try {
                const resposta = await fetch(`http://127.0.0.1:5000/api/favoritos/${animeId}`, {
                    method: "DELETE",
                    headers: { Authorization: token }
                });

                if (resposta.ok) {
                    mostrarMensagem("Removido dos favoritos!", true);
                    const card = event.target.closest(".card");
                    if (card) card.remove();
                } else {
                    const erro = await resposta.json();
                    mostrarMensagem(erro.mensagem || "Erro ao remover", false);
                }

            } catch (erro) {
                console.error("Erro na requisição DELETE:", erro);
                mostrarMensagem("Erro de conexão ao remover", false);
            }
        }

        // Lógica para assistir ao vídeo no modal
        if (event.target.classList.contains("assistir")) {
            const videoUrl = event.target.dataset.videoUrl;
            if (videoUrl) {
                modalVideoPlayer.src = videoUrl; // Define a fonte do vídeo
                videoModal.classList.remove('oculto'); // Mostra o modal
                modalVideoPlayer.play(); // Inicia a reprodução
            } else {
                mostrarMensagem("URL do vídeo não disponível.", false);
            }
        }
    });

    // 🎥 Listeners para o Modal de Vídeo
    // Fechar modal ao clicar no 'x'
    fecharModalBtn.addEventListener('click', () => {
        modalVideoPlayer.pause(); // Pausa o vídeo
        modalVideoPlayer.currentTime = 0; // Volta o vídeo para o início
        videoModal.classList.add('oculto'); // Esconde o modal
    });

    // Fechar modal ao clicar fora do conteúdo (overlay)
    videoModal.addEventListener('click', (event) => {
        if (event.target === videoModal) { // Se o clique foi no overlay, não no conteúdo
            modalVideoPlayer.pause();
            modalVideoPlayer.currentTime = 0;
            videoModal.classList.add('oculto');
        }
    });

    // Fechar modal ao pressionar ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !videoModal.classList.contains('oculto')) {
            modalVideoPlayer.pause();
            modalVideoPlayer.currentTime = 0;
            videoModal.classList.add('oculto');
        }
    });

    // 📦 Função para carregar e exibir os favoritos
    async function carregarFavoritos() {
        try {
            const resposta = await fetch("http://127.0.0.1:5000/api/favoritos", {
                headers: { Authorization: token }
            });

            const favoritos = await resposta.json();
            grid.innerHTML = ''; // Limpa o grid antes de adicionar novos cards

            const unicos = favoritos.filter(
                (fav, index, self) =>
                    index === self.findIndex((f) => f.animeId === fav.animeId)
            );

            if (unicos.length === 0) {
                grid.innerHTML = "<p>Você ainda não tem animes favoritos.</p>";
                return;
            }

            for (const fav of unicos) {
                const card = document.createElement("div");
                card.classList.add("card");

               const imagemHtml = fav.video
  ? `<video muted playsinline preload="metadata" width="100%" style="max-height: 180px;">
        <source src="${fav.video}" type="video/mp4">
     </video>`
  : `<div class="placeholder-image"></div>`;


                // Adiciona o botão "Assistir" se a URL do vídeo estiver disponível
                const assistirButton = fav.video
                    ? `<button class="assistir" data-video-url="${fav.video}">▶️ Assistir</button>`
                    : ''; // Não mostra o botão se não houver vídeo

                card.innerHTML = `
                    ${imagemHtml}
                    <p><strong>${fav.titulo}</strong></p>
                    ${assistirButton}
                    <button class="remover" data-id="${fav.animeId}">🗑️ Remover</button>
                `;
                grid.appendChild(card);
            }
        } catch (erro) {
            console.error("Erro ao buscar favoritos:", erro);
            grid.innerHTML = "<p>Erro ao carregar favoritos. Tente novamente.</p>";
        }
    }

    // Chama a função para carregar os favoritos ao carregar a página
    carregarFavoritos();
});

// ==========================
// 🔓 BOTÃO SAIR
// Gerencia o logout do usuário.
// ==========================
const botaoSair = document.getElementById("botao-sair");
if (botaoSair) {
    botaoSair.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("nome");
        window.location.href = "login.html";
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("lista-favoritos");
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  if (favoritos.length === 0) {
    container.innerHTML = "<p style='color: #ccc;'>Nenhum anime favoritado ainda.</p>";
    return;
  }

  favoritos.forEach(anime => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-genero", anime.genero);

    card.innerHTML = `
      <img src="${anime.imagem}" alt="${anime.titulo}" />
      <h3>${anime.titulo}</h3>
      <span class="genero">${anime.genero}</span>
      <p class="sinopse">${anime.sinopse}</p>
      <div class="avaliacao">${anime.nota}</div>
      <div class="botoes-card">
        <button class="botao assistir" title="Assistir agora">▶</button>
        <button class="botao remover" title="Remover dos favoritos">🗑</button>
      </div>
    `;

    // Botão de remover
    card.querySelector(".remover").addEventListener("click", () => {
      const novosFavoritos = favoritos.filter(fav => fav.titulo !== anime.titulo);
      localStorage.setItem("favoritos", JSON.stringify(novosFavoritos));
      card.remove();
    });

    container.appendChild(card);
  });
});

const usuario = localStorage.getItem("usuario");
if (!usuario) {
  window.location.href = "login.html";
}
