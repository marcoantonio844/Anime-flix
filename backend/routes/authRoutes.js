const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Rota de cadastro
router.post("/register", async (req, res) => {
const { nome, email, senha, avatar } = req.body;

  try {
    const existeUsuario = await User.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ mensagem: "Email já cadastrado" });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = new User({
  nome,
  email,
  senha: senhaCriptografada,
  avatar
});

    await novoUsuario.save();

    res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao cadastrar usuário" });
  }
});

// Rota de login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: "Senha incorreta" });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

   res.json({ token, nome: usuario.nome });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao fazer login" });
  }
});

// Rota para obter dados do usuário logado
router.get("/getUser", async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ mensagem: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await User.findById(decoded.id).select("-senha");

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (erro) {
    res.status(401).json({ mensagem: "Token inválido" });
  }
});

module.exports = router;
