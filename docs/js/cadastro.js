document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("usuario").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value.trim();

    if (!nome || !email || !senha) {
      mostrarMensagem("⚠️ Preencha todos os campos!");
      return;
    }

    // Carrega lista de usuários ou cria uma nova
    const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verifica se o email já foi usado
    const jaExiste = usuariosSalvos.find(u => u.email === email);
    if (jaExiste) {
      mostrarMensagem("⚠️ Já existe um usuário com este e-mail.");
      return;
    }

    const novoUsuario = {
      usuario: nome,
      email: email,
      senha: senha,
      avatar: "avatar1.png"
    };

    usuariosSalvos.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosSalvos));

    mostrarMensagem("✅ Cadastro realizado com sucesso!");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  });
});

function mostrarMensagem(texto) {
  let msg = document.getElementById("mensagem-sucesso");

  if (!msg) {
    msg = document.createElement("div");
    msg.id = "mensagem-sucesso";
    msg.className = "mensagem oculto";
    document.body.appendChild(msg);
  }

  msg.textContent = texto;
  msg.classList.remove("oculto");
  msg.classList.add("visivel");

  setTimeout(() => {
    msg.classList.remove("visivel");
    msg.classList.add("oculto");
  }, 3000);
}
