document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-redefinir");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const novaSenha = document.getElementById("nova-senha").value.trim();
    if (!novaSenha) {
      mostrarMensagem("⚠️ Digite uma nova senha.");
      return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
      usuario.senha = novaSenha;
      localStorage.setItem("usuario", JSON.stringify(usuario));
      mostrarMensagem("✅ Senha redefinida com sucesso!");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } else {
      mostrarMensagem("❌ Nenhum usuário encontrado.");
    }
  });
});

function mostrarMensagem(texto) {
  const msg = document.getElementById("mensagem-sucesso");
  if (!msg) return;
  msg.textContent = texto;
  msg.classList.remove("oculto");
  msg.classList.add("visivel");

  setTimeout(() => {
    msg.classList.remove("visivel");
    msg.classList.add("oculto");
  }, 3000);
}
