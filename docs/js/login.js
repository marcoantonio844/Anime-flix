document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form-login");

  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email-login").value.trim().toLowerCase();
    const senha = document.getElementById("senha-login").value.trim();

    const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioEncontrado = listaUsuarios.find(user => user.email === email && user.senha === senha);

    if (usuarioEncontrado) {
      localStorage.setItem("token", "usuario-logado");
      localStorage.setItem("nome", usuarioEncontrado.usuario);
      localStorage.setItem("avatar", usuarioEncontrado.avatar || "avatar1.png");

      mostrarMensagem("✅ Login realizado com sucesso!");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } else {
      mostrarMensagem("❌ Email ou senha incorretos.");
    }
  });

  function mostrarMensagem(texto) {
    let msg = document.getElementById("mensagem-sucesso");

    if (!msg) {
      msg = document.createElement("div");
      msg.id = "mensagem-sucesso";
      msg.className = "mensagem oculto";
      document.body.prepend(msg);
    }

    msg.textContent = texto;
    msg.classList.remove("oculto");
    msg.classList.add("visivel");

    setTimeout(() => {
      msg.classList.remove("visivel");
      msg.classList.add("oculto");
    }, 3000);
  }
});


// Evento de recuperação de senha
document.getElementById("link-recuperar-senha").addEventListener("click", (e) => {
  e.preventDefault();

  const email = prompt("Digite seu e-mail para recuperar a senha:");

  if (email && email.includes("@")) {
const templateParams = {
  email: email,
  link: "https://cheery-kelpie-7988d9.netlify.app/redefinir-senha.html"
};

emailjs.send("service_2a1xcoi", "rvd1wzq", templateParams)

      .then(() => {
        mostrarMensagem("📧 E-mail de recuperação enviado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao enviar e-mail:", error);
        mostrarMensagem("❌ Erro ao enviar e-mail. Tente novamente.");
      });
  } else if (email !== null) {
    mostrarMensagem("⚠️ Digite um e-mail válido.");
  }
});
