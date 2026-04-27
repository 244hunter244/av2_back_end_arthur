const express = require('express');
const app = express();

app.use(express.json());

// fingindo que isso aqui são as tabelas do sql
let filmes = [];
let usuarios = [];
let favoritos = [];

// --- parte dos filmes ---

// pega a lista completa de filmes
app.get('/filmes', (req, res) => {
    res.status(200).json(filmes);
});

// cria um filme novo no catalogo
app.post('/filmes', (req, res) => {
    const { titulo, genero, ano_lancamento } = req.body;
    
    if (!titulo || !genero || !ano_lancamento) {
        return res.status(400).json({ erro: "precisa preencher tudo aí" });
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

// apaga um filme pelo id
app.delete('/filmes/:id', (req, res) => {
    const { id } = req.params;
    const existe = filmes.find(f => f.id == id);
    if (!existe) return res.status(404).json({ erro: "filme nem existe" });

    filmes = filmes.filter(f => f.id != id);
    res.status(200).json({ mensagem: "apagado com sucesso" });
});

// --- parte dos usuarios ---

// mostra todo mundo que tá cadastrado
app.get('/usuarios', (req, res) => {
    res.status(200).json(usuarios);
});

// cadastra usuario novo
app.post('/usuarios', (req, res) => {
    const { nome, email, plano } = req.body;

    if (!nome || !email || !plano) {
        return res.status(400).json({ erro: "nome, email e plano sao obrigatorios" });
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

// edita os dados de alguem
app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, plano } = req.body;
    
    const usuario = usuarios.find(u => u.id == id);
    if (!usuario) return res.status(404).json({ erro: "usuario nao encontrado" });

    if (nome) usuario.nome = nome;
    if (email) usuario.email = email;
    if (plano) usuario.plano = plano;

    res.status(200).json(usuario);
});

// --- parte dos favoritos ---

// adiciona um filme na lista de alguem
app.post('/favoritos', (req, res) => {
    const { id_usuario, id_filme } = req.body;

    const usuarioExiste = usuarios.find(u => u.id == id_usuario);
    const filmeExiste = filmes.find(f => f.id == id_filme);

    if (!usuarioExiste || !filmeExiste) {
        return res.status(404).json({ erro: "da pra favoritar nao, id errado" });
    }

    const novoFavorito = { 
        id: Date.now(), 
        id_usuario, 
        id_filme 
    };
    favoritos.push(novoFavorito);
    res.status(201).json(novoFavorito);
});

// ver todos os favoritos do sistema
app.get('/favoritos', (req, res) => {
    res.status(200).json(favoritos);
});

// busca só os favoritos de um usuario especifico
app.get('/favoritos/usuario/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    
    const listaFavoritos = favoritos.filter(fav => fav.id_usuario == id_usuario);
    
    // aqui ele retorna os filmes e ignora se o filme foi deletado
    const detalhesFilmes = listaFavoritos
        .map(fav => filmes.find(f => f.id == fav.id_filme))
        .filter(f => f !== undefined); 

    res.status(200).json(detalhesFilmes);
});

// --- so pra rodar o servidor ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`cinestream rodando na porta ${PORT}`);
});