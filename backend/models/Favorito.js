const mongoose = require("mongoose");

const favoritoSchema = new mongoose.Schema({
    usuarioId: {
        type: String,
        required: true // O ID do usuário que favoritou
    },
    animeId: {
        type: String,
        required: true // O ID único do anime (da sua lista interna ou da API externa, se aplicável)
    },
    titulo: {
        type: String,
        required: true // O título do anime
    },
    // Novos campos para armazenar a URL da imagem de capa e a URL do vídeo
    imagem: {
        type: String,
        required: false // 'false' porque talvez nem todo anime tenha uma imagem
    },
    video: {
        type: String,
        required: false // 'false' porque nem todo anime terá um vídeo direto
    }
});

module.exports = mongoose.model("Favorito", favoritoSchema);
