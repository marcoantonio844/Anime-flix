const express = require("express");
const router = express.Router();
const Favorito = require("../models/Favorito");
const jwt = require("jsonwebtoken");

// ➕ Rota para adicionar um favorito
router.post("/", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ mensagem: "Token não fornecido" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { animeId, titulo, imagem, video } = req.body; 

        // Verifica se o anime já existe nos favoritos do usuário
        // Se a intenção é permitir apenas uma entrada por animeId por usuário,
        // esta verificação é importante.
        const jaExiste = await Favorito.findOne({
            usuarioId: decoded.id,
            animeId
        });

        if (jaExiste) {
            // Se já existe, você pode optar por atualizar os campos 'imagem' e 'video'
            // ou apenas retornar que já está favoritado. Retornamos aqui para evitar duplicatas.
            return res.status(400).json({ mensagem: "Anime já está nos seus favoritos" });
        }

        const novoFavorito = new Favorito({
            usuarioId: decoded.id,
            animeId,
            titulo,
            imagem,
            video
        });

        await novoFavorito.save();
        res.status(201).json({ mensagem: "Favoritado com sucesso!" });

    } catch (erro) {
        console.error("Erro ao favoritar:", erro);
        res.status(500).json({ mensagem: "Erro ao favoritar" });
    }
});

// 📦 Rota para listar os favoritos do usuário
router.get("/", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ mensagem: "Token não enviado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const favoritos = await Favorito.find({ usuarioId: decoded.id });
        res.json(favoritos);
    } catch (erro) {
        console.error("Erro ao buscar favoritos:", erro);
        res.status(500).json({ mensagem: "Erro ao buscar favoritos" });
    }
});

// 🗑️ Rota para remover um favorito (AGORA REMOVE TODAS AS OCORRÊNCIAS)
router.delete("/:animeId", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ mensagem: "Token não enviado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { animeId } = req.params;

        // Alterado de findOneAndDelete para deleteMany para remover todas as ocorrências
        const resultado = await Favorito.deleteMany({
            usuarioId: decoded.id,
            animeId
        });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({ mensagem: "Anime não encontrado nos favoritos ou já removido" });
        }

        res.status(200).json({ mensagem: "Removido dos favoritos com sucesso!" });
    } catch (erro) {
        console.error("Erro ao remover favorito:", erro);
        res.status(500).json({ mensagem: "Erro ao remover favorito" });
    }
});

module.exports = router;
