const express = require('express');
const app = express();

app.use(express.json());

// Simulando as tabelas do SQL em Arrays
let filmes = [];
let usuarios = [];
let favoritos = [];

// --- GESTÃO DE FILMES ---

// Listar todos os filmes
app.get('/filmes', (req, res) => {
    res.status(200).json(filmes);
});

// Cadastrar novo filme
app.post('/filmes', (req, res) => {
    const { titulo, genero, ano_lancamento } = req.body;
    
    if (!titulo || !genero || !ano_lancamento) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
    }

    const novoFilme = { 
        id: Date.now(), 
        titulo, 
        genero, 
        ano_lancamento 
    };
    filmes.push(novoFilme);
    res.status(201).json(novoFilme);
});

// Remover filme
app.delete('/filmes/:id', (req, res) => {
    const { id } = req.params;
    const existe = filmes.find(f => f.id == id);
    if (!existe) return res.status(404).json({ erro: "Filme não encontrado" });

    filmes = filmes.filter(f => f.id != id);
    res.status(200).json({ mensagem: "Filme removido com sucesso" });
});

// --- GESTÃO DE USUÁRIOS ---

// Listar todos os usuários
app.get('/usuarios', (req, res) => {
    res.status(200).json(usuarios);
});

// Cadastrar usuário
app.post('/usuarios', (req, res) => {
    const { nome, email, plano } = req.body;

    if (!nome || !email || !plano) {
        return res.status(400).json({ erro: "Nome, email e plano são obrigatórios" });
    }

    const novoUsuario = { 
        id: Date.now(), 
        nome, 
        email, 
        plano 
    };
    usuarios.push(novoUsuario);
    res.status(201).json(novoUsuario);
});

// Atualizar usuário
app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, plano } = req.body;
    
    const usuario = usuarios.find(u => u.id == id);
    if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });

    if (nome) usuario.nome = nome;
    if (email) usuario.email = email;
    if (plano) usuario.plano = plano;

    res.status(200).json(usuario);
});

// --- SISTEMA DE FAVORITOS ---

// Adicionar aos favoritos
app.post('/favoritos', (req, res) => {
    const { id_usuario, id_filme } = req.body;

    const usuarioExiste = usuarios.find(u => u.id == id_usuario);
    const filmeExiste = filmes.find(f => f.id == id_filme);

    if (!usuarioExiste || !filmeExiste) {
        return res.status(404).json({ erro: "Usuário ou Filme não encontrado" });
    }

    const novoFavorito = { 
        id: Date.now(), 
        id_usuario, 
        id_filme 
    };
    favoritos.push(novoFavorito);
    res.status(201).json(novoFavorito);
});

// Listar todos os relacionamentos de favoritos
app.get('/favoritos', (req, res) => {
    res.status(200).json(favoritos);
});

// Listar filmes favoritos de um usuário específico
app.get('/favoritos/usuario/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    
    const listaFavoritos = favoritos.filter(fav => fav.id_usuario == id_usuario);
    
    // Retorna os dados dos filmes, filtrando caso o filme tenha sido deletado do catálogo
    const detalhesFilmes = listaFavoritos
        .map(fav => filmes.find(f => f.id == fav.id_filme))
        .filter(f => f !== undefined); 

    res.status(200).json(detalhesFilmes);
});

// --- INICIALIZAÇÃO ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`CineStream rodando em http://localhost:${PORT}`);
});