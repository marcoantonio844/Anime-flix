document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const saudacao = document.getElementById("saudacao");
  const dados = JSON.parse(localStorage.getItem("usuario"));
  const nome = dados?.usuario;

  if (nome && saudacao) {
    saudacao.textContent = `Bem-vindo(a), ${nome}!`;
  }
});

// ❤️ Favoritar
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".grid")?.addEventListener("click", async (e) => {
    if (e.target.classList.contains("favoritar")) {
      const btn = e.target;
      const animeId = btn.dataset.id;
      const titulo = btn.dataset.title;
      const imagem = btn.dataset.image;
      const video = btn.dataset.video;
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:5000/api/favoritos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
          body: JSON.stringify({ animeId, titulo, imagem, video })
        });

        const data = await res.json();
        alert(res.ok ? `❤️ ${titulo} adicionado aos favoritos!` : (data.mensagem || "Erro ao favoritar"));
      } catch (error) {
        console.error("Erro ao favoritar:", error);
        alert("Erro ao se conectar com o servidor.");
      }
    }
  });
});

// 🌙 Modo Escuro/Claro
document.addEventListener("DOMContentLoaded", () => {
  const botaoTema = document.getElementById("toggle-tema");
  const body = document.body;

  if (localStorage.getItem("tema") === "escuro") {
    body.classList.add("tema-escuro");
    botaoTema.textContent = "☀️ Modo Claro";
  }

  botaoTema?.addEventListener("click", () => {
    body.classList.toggle("tema-escuro");
    const temaAtual = body.classList.contains("tema-escuro") ? "escuro" : "claro";
    localStorage.setItem("tema", temaAtual);
    botaoTema.textContent = temaAtual === "escuro" ? "☀️ Modo Claro" : "🌙 Modo Escuro";
  });
});

// 🔓 Logout
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logout")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
  });
});

// 👤 Avatar
document.addEventListener("DOMContentLoaded", () => {
  const avatarImg = document.getElementById("avatar-usuario");
  const dados = JSON.parse(localStorage.getItem("usuario"));
  const nome = dados?.usuario;
  const caminho = localStorage.getItem("avatar") || "avatar1.png";
  const menu = document.getElementById("menu-avatar");

  if (avatarImg) {
    avatarImg.src = `img/${caminho}`;
    avatarImg.title = nome || "Usuário";
    avatarImg.onerror = () => {
      avatarImg.src = `https://ui-avatars.com/api/?name=${nome}&background=00c853&color=fff&bold=true`;
    };
  }

  avatarImg?.addEventListener("click", () => {
    menu?.classList.toggle("oculto");
  });

  document.querySelectorAll("#menu-avatar img").forEach(img => {
    img.addEventListener("click", () => {
      const novoAvatar = img.dataset.avatar;
      localStorage.setItem("avatar", novoAvatar);
      avatarImg.src = `img/${novoAvatar}`;
      menu.classList.add("oculto");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".avatar-wrapper")) {
      menu?.classList.add("oculto");
    }
  });
});

// 🎬 Modal de vídeo
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal-video");
  const player = document.getElementById("player-video");
  const fechar = document.querySelector(".fechar-modal");

  document.querySelector(".grid")?.addEventListener("click", (e) => {
    if (e.target.classList.contains("assistir")) {
      const url = e.target.dataset.video;
      player.src = url;
      modal.classList.remove("oculto");
      player.play();
    }
  });

  fechar?.addEventListener("click", () => {
    player.pause();
    player.currentTime = 0;
    player.src = "";
    modal.classList.add("oculto");
  });

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      player.pause();
      player.currentTime = 0;
      player.src = "";
      modal.classList.add("oculto");
    }
  });
});

// 🔍 Busca
document.addEventListener("DOMContentLoaded", () => {
  const campoBusca = document.getElementById("campo-pesquisa");
  campoBusca?.addEventListener("input", () => {
    const termo = campoBusca.value.toLowerCase();
    document.querySelectorAll(".card").forEach(card => {
      const titulo = card.querySelector("strong")?.textContent.toLowerCase();
      card.style.display = titulo?.includes(termo) ? "block" : "none";
    });
  });
});

// 🧲 Menu lateral por hover
document.addEventListener("DOMContentLoaded", () => {
  const hoverZone = document.getElementById("detector-hover");
  const barraLateral = document.querySelector(".menu-lateral");

  let hoverTimeout;

  function abrirMenu() {
    clearTimeout(hoverTimeout);
    document.body.classList.add("menu-aberta");
  }

  function fecharMenu() {
    hoverTimeout = setTimeout(() => {
      if (!hoverZone.matches(':hover') && !barraLateral.matches(':hover')) {
        document.body.classList.remove("menu-aberta");
      }
    }, 150);
  }

  hoverZone?.addEventListener("mouseenter", abrirMenu);
  barraLateral?.addEventListener("mouseenter", abrirMenu);
  hoverZone?.addEventListener("mouseleave", fecharMenu);
  barraLateral?.addEventListener("mouseleave", fecharMenu);
});

// 📱 Menu lateral por botão
document.addEventListener("DOMContentLoaded", () => {
  const botaoMenu = document.getElementById("botao-menu");
  const barra = document.querySelector(".menu-lateral");

  botaoMenu?.addEventListener("click", () => {
    document.body.classList.toggle("menu-aberta");
  });

  barra?.addEventListener("mouseleave", () => {
    if (window.innerWidth <= 768) {
      document.body.classList.remove("menu-aberta");
    }
  });
});

// 🎠 Carrossel
document.addEventListener("DOMContentLoaded", () => {
  const botoes = document.querySelectorAll(".seta");

  botoes.forEach(botao => {
    botao.addEventListener("click", () => {
      const container = botao.parentElement.querySelector(".carrossel-scroll");
      const direcao = botao.classList.contains("direita") ? 1 : -1;
      const largura = container.clientWidth;
      container.scrollBy({ left: direcao * largura * 0.8, behavior: "smooth" });
    });
  });
});

// 🖼️ Slide automático
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  let index = 0;

  function mostrarSlide(i) {
    slides.forEach(slide => slide.classList.remove("ativo"));
    slides[i].classList.add("ativo");
  }

  function proximoSlide() {
    index = (index + 1) % slides.length;
    mostrarSlide(index);
  }

  setInterval(proximoSlide, 5000);
});

// 🧼 Ocultar cards com imagem quebrada
document.querySelectorAll(".card").forEach(card => {
  const img = card.querySelector("img");
  if (!img || !img.src || img.src.includes("undefined")) {
    card.style.display = "none";
  }
});

document.querySelectorAll(".botao.detalhes").forEach(botao => {
  botao.addEventListener("click", () => {
    const card = botao.closest(".card");
    const titulo = card.querySelector("h3").textContent;
    const genero = card.querySelector(".genero").textContent;
    const sinopse = card.querySelector(".sinopse").textContent;
    const nota = card.querySelector(".avaliacao").textContent;

    const conteudo = `
      <h2>${titulo}</h2>
      <div class="info-extra">${genero} • ${nota}</div>
      <p>${sinopse}</p>
      <button class="botao assistir">▶ Assistir agora</button>
    `;

    document.getElementById("conteudo-detalhes").innerHTML = conteudo;
    document.getElementById("modal-detalhes").classList.remove("oculto");
  });
});
