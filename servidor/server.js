//Pega os frameworks do Node.js a serem usados
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const rotaBluesky = require('./social/bluesky');
const rotaYoutube = require('./social/youtube');
const rotaTwitch = require('./social/twitch');

const app = express();
const PORT = 3000;

//Caminho do arquivo JSON dos usuários
const caminhoJson = path.join(__dirname, 'json/usuarios.json');

//Declaração dos middlewares -------

// Middleware para liberar e mexer nos arquivos da pasta publico pro front-end
app.use(express.static(path.join(__dirname, '../publico')));

//Middleware para processar JSON no body das requisições
app.use(express.json());

//Middleware para fazer o controle das sessions
app.use(session({
    secret: process.env.SESSION_SECRET, //Chave que eu criei pra assinatura dos cookies
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } //Indica que não vai ter protocolo HTTPS
}));

//Aplica o arquivo bluesky.js quando tiver requisição na página do bluesky
app.use('/bluesky', rotaBluesky);
app.use('/youtube', rotaYoutube);
app.use('/twitch', rotaTwitch);

// Função para carregar os usuários do arquivo JSON
function carregarUsuarios() {

    try {

        //Lê o arquivo usuarios.json, se estiver tudo certo, retorna o conteudo do arquivo formatado como objetos
        const data = fs.readFileSync(caminhoJson, 'utf8');
        return JSON.parse(data);
    }

    // Se o arquivo não existir ou estiver vazio, retorna um array vazio
    catch (error) {
        return [];
    }
}

//Função para salvar o conteudo atualizado do arquivo usuarios.json
function salvarUsuarios(usuarios) {

    //Salva o arquivo com o conteudo atual, formatando os objetos para o arquivo json
    fs.writeFileSync(caminhoJson, JSON.stringify(usuarios, null, 2), 'utf8');
}

app.get('/carregarContas', (req, res) => {
    const usuarios = carregarUsuarios();
    const userId = req.session.userId;

    const userIndex = usuarios.findIndex(u => u.id === userId);

    // Verifica se o usuário foi encontrado
    if (userIndex === -1) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Retorna as redes do usuário
    return res.json({ contas: usuarios[userIndex].redes });
});

//Faz o cadastro ao ouvir um post no endereço /Cadastrar
app.post('/Cadastrar', (req, res) => {

    //Pega os dados enviados no fetch
    const { email, senha } = req.body;

    // Carrega os usuários existentes
    let usuarios = carregarUsuarios();

    // Verifica se o usuário já existe, se sim, retorna um não-sucesso
    const user = usuarios.find(u => u.email === email && u.senha === senha);

    if (user) {
        return res.json({ sucesso: false }); // Usuário já ta cadastrado
    }

    let usuarioId = "";

    //Se não existir nenhum usuário, cria o primeiro com o ID '1'
    //Senão, atribui o ID do usuário incrementando com o último já existente
    if (usuarios.length == 0) {
        usuarioId = 1;
    }
    else {
        usuarioId = (usuarios[(usuarios.length - 1)].id + 1);
    }

    //Adiciona o novo usuário
    usuarios.push({id: usuarioId, email, senha, redes: {
        blueskye: [],
        youtube: [],
        twitch: []
    }});

    // Salva os usuários atualizados no arquivo JSON
    salvarUsuarios(usuarios);

    //Cadastrou yay
    res.json({ sucesso: true });
});

//Faz o login do usuário
app.post('/Logar', (req, res) => {

    //Pega os dados enviados no fetch
    const { email, senha } = req.body;

    // Carrega os usuários existentes
    let usuarios = carregarUsuarios();

    // Verifica se os dados existem
    const user = usuarios.find(u => u.email === email && u.senha === senha);

    if (!user) {
        return res.json({ sucesso: false }); // Usuário não encontrado
    }

    //Atribui o ID do usuário na session
    req.session.userId = user.id;

    //Logou yay
    res.json({ sucesso: true});
})

//---------------------------------------------------------

//Checa o login
app.get('/check-login', (req, res) => {

    //Se existir uma seção ativa com o id de um usuário, retorna que tem alguém logado
    //Senão retorna que não tem login feito
    if (req.session.userId) {

        res.json({ logado: true });
    } else {

        res.json({ logado: false });
    }
});

app.get('/profile', (req, res) => {
    const usuarios = carregarUsuarios();
    const userId = req.session.userId;

    const userIndex = usuarios.findIndex(u => u.id === userId);

    // Verifica se o usuário foi encontrado
    if (userIndex === -1) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Retorna o usuário
    return res.json({ conta: usuarios[userIndex] });
})

app.get('/sair', (req, res) => {
    // Verifica se a sessão existe
    if (req.session) {
        try {
            // Destrói a sessão para deslogar o usuário
            req.session.destroy((err) => {
                if (err) {
                    console.error('Erro ao encerrar a sessão:', err);
                    return res.status(500).send('Erro ao deslogar');
                }
                // Limpa o cookie de sessão
                res.clearCookie('connect.sid');
                // Redireciona para a página inicial
                res.json({ sucesso: true});
            });
        }
        catch(error) {
            console.error('Erro ao encerrar a sessão:', err);
        }
    }
    else {
        res.json({ sucesso: false});
    }
});

app.get('/excluirConta', (req, res) => {
    // Verifica se a sessão existe
    if (req.session) {

        try {
            id = req.session.userId;
            let usuarios = carregarUsuarios();

            usuarios = usuarios.filter(usuario => usuario.id !== id);

            // Salva os usuários atualizados no arquivo JSON
            salvarUsuarios(usuarios);

            // Destrói a sessão para deslogar o usuário
            req.session.destroy((err) => {
                if (err) {
                    console.error('Erro ao encerrar a sessão:', err);
                    return res.status(500).send('Erro ao deslogar');
                }
                // Limpa o cookie de sessão
                res.clearCookie('connect.sid');
                // Redireciona para a página inicial
                res.json({ sucesso: true});
            });
        }
        catch(error) {
            console.error('Erro ao encerrar a sessão:', err);
        }
    }
    else {
        res.json({ sucesso: false});
    }
})

// Serve o arquivo HTML
app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, '../publico/index.html'));
});

// Inicializa o servidor
app.listen(PORT, () => {

    console.log(`Servidor rodando em http://localhost:${PORT}`);
});