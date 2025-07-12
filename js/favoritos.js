let timeoutMensagem;

function mostrarMensagem(texto, sucesso = true) {
  const msg = document.getElementById("mensagem-sucesso");
  clearTimeout(timeoutMensagem);
  msg.textContent = texto;
  msg.style.backgroundColor = sucesso ? "#00c853" : "#e53935";
  msg.classList.remove("mensagem-oculta");
  msg.style.opacity = "0";
  void msg.offsetWidth;
  msg.style.opacity = "1";
  timeoutMensagem = setTimeout(() => {
    msg.style.opacity = "0";
    setTimeout(() => {
      msg.classList.add("mensagem-oculta");
    }, 300);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("favoritos-grid");
  const token = localStorage.getItem("token");

  const videoModal = document.getElementById("video-modal");
  const modalVideoPlayer = document.getElementById("modal-video-player");
  const fecharModalBtn = document.querySelector(".fechar-modal");

  if (token) {
    try {
      const resposta = await fetch("http://127.0.0.1:5000/api/favoritos", {
        headers: { Authorization: token }
      });

      if (!resposta.ok) throw new Error("Erro ao buscar do backend");

      const favoritos = await resposta.json();
      renderizarFavoritos(favoritos, grid, true);
      return;
    } catch (erro) {
      console.warn("⚠️ Erro ao buscar do backend, tentando localStorage...");
    }
  }

  const favoritosLocal = JSON.parse(localStorage.getItem("favoritos")) || [];
  renderizarFavoritos(favoritosLocal, grid, false);

  // Modal: fechar
  fecharModalBtn.addEventListener("click", () => {
    modalVideoPlayer.pause();
    modalVideoPlayer.currentTime = 0;
    videoModal.classList.add("oculto");
  });

  videoModal.addEventListener("click", (event) => {
    if (event.target === videoModal) {
      modalVideoPlayer.pause();
      modalVideoPlayer.currentTime = 0;
      videoModal.classList.add("oculto");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !videoModal.classList.contains("oculto")) {
      modalVideoPlayer.pause();
      modalVideoPlayer.currentTime = 0;
      videoModal.classList.add("oculto");
    }
  });

  // Logout
  const botaoSair = document.getElementById("botao-sair");
  if (botaoSair) {
    botaoSair.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  }
});

function renderizarFavoritos(favoritos, grid, doBackend = false) {
  grid.innerHTML = "";

  if (favoritos.length === 0) {
    grid.innerHTML = "<p style='color: #ccc;'>Nenhum anime favoritado ainda.</p>";
    return;
  }

  favoritos.forEach(anime => {
    const card = document.createElement("div");
    card.classList.add("card");

    const imagemHtml = anime.video
      ? `<video muted playsinline preload="metadata" width="100%" style="max-height: 180px;">
            <source src="${anime.video}" type="video/mp4">
         </video>`
      : `<img src="${anime.imagem}" alt="${anime.titulo}" />`;

    const assistirButton = anime.video
      ? `<button class="assistir" data-video-url="${anime.video}">▶️ Assistir</button>`
      : "";

    card.innerHTML = `
      ${imagemHtml}
      <h3>${anime.titulo}</h3>
      <span class="genero">${anime.genero || ""}</span>
      <p class="sinopse">${anime.sinopse || ""}</p>
      <div class="avaliacao">${anime.nota || anime.avaliacao || ""}</div>
      <div class="botoes-card">
        ${assistirButton}
        <button class="remover" data-id="${anime.animeId || anime.titulo}">🗑️ Remover</button>
      </div>
    `;

    // Remover favorito
    card.querySelector(".remover").addEventListener("click", () => {
      if (doBackend) {
        removerFavoritoBackend(anime.animeId, card);
      } else {
        removerFavoritoLocal(anime.titulo, card);
      }
    });

    // Assistir vídeo
    const assistir = card.querySelector(".assistir");
    if (assistir) {
      assistir.addEventListener("click", () => {
        const videoUrl = assistir.dataset.videoUrl;
        const modal = document.getElementById("video-modal");
        const player = document.getElementById("modal-video-player");
        player.src = videoUrl;
        modal.classList.remove("oculto");
        player.play();
      });
    }

    grid.appendChild(card);
  });
}

function removerFavoritoBackend(animeId, card) {
  const token = localStorage.getItem("token");
  fetch(`http://127.0.0.1:5000/api/favoritos/${animeId}`, {
    method: "DELETE",
    headers: { Authorization: token }
  })
    .then(res => res.ok ? card.remove() : mostrarMensagem("Erro ao remover", false))
    .catch(() => mostrarMensagem("Erro de conexão", false));
}

function removerFavoritoLocal(titulo, card) {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const atualizados = favoritos.filter(fav => fav.titulo !== titulo);
  localStorage.setItem("favoritos", JSON.stringify(atualizados));
  card.remove();
}
