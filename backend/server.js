const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Essencial para construir caminhos corretamente

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Remova a linha 'const mime = require("mime");' se não for usada em outro lugar,
// e remova o middleware manual do Content-Type, pois express.static já lida com isso.
// Você pode remover esta seção inteira:
/*
const mime = require("mime");
app.use("/videos", (req, res, next) => {
    res.setHeader("Content-Type", mime.getType(req.path));
    next();
}, express.static(path.join(__dirname, "videos")));
*/

// 🌐 Servir todos os arquivos da pasta 'frontend' (HTML, CSS, JS, Imagens).
// O caminho '__dirname' é o diretório do 'server.js' (que é 'backend').
// '..' sobe um nível para a raiz do projeto.
// 'frontend' então entra na pasta 'frontend'.
// Isso permite que você acesse 'home.html', 'style.css', 'js/home.js', 'img/avatar1.png' etc.,
// diretamente se o seu front-end fosse servido por este mesmo servidor.
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// 📺 Servir os vídeos locais da pasta 'frontend/videos'.
// O prefixo '/videos' na URL (e.g., http://localhost:5000/videos/jujutsu-kaisen.mp4)
// será mapeado para a pasta real 'seu-projeto/frontend/videos'.
// Esta é a LINHA CRÍTICA que você precisa mudar para funcionar.
app.use('/videos', express.static(path.join(__dirname, '..', 'frontend', 'videos')));

// 🔗 Rotas backend
const authRoutes = require('./routes/authRoutes');
const favoritoRoutes = require('./routes/favoritoRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/favoritos', favoritoRoutes);

// ✅ Rota de status
app.get('/', (req, res) => {
    res.send('Servidor está funcionando! ✅');
});

// 🛠️ Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('🟢 Conectado ao MongoDB'))
.catch(err => console.error('❌ Erro ao conectar ao banco:', err));

// 🚀 Inicializa o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});