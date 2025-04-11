// pegando os frames a serem utilizados
const express = require('express');
const router = express.Router();
const path = require("path");
const axios = require("axios");
const fs = require('fs'); 

// funçao de pesquisar os perfis publicos
router.get('/search', async (req, res) => {
    // iniciando a pesquisa
    try {
        const { user } = req.query;

        if (!user) {
            return res.status(400).json({ error: 'O termo de pesquisa é necessário.' });
        }

        // pega a chave da api e faz a requisição de 7 perfis 
        const key = process.env.YOUTUBE_PUBLIC_KEY;
        const maxResults = 7;
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(user)}&maxResults=${maxResults}&key=${key}`;

        // pegando a url da resposta
        const response = await fetch(url);

        //vendo se esta tudo certo, se nao estiver cria a mensagem de erro
        if (!response.ok) throw new Error("Erro na requisição");

        // arrumando a resposta 
        const data = await response.json();

        // filtra os dados necessarios sobre cada canal encontrado
        const canais = data.items.map(item => ({
            nome: item.snippet.title,
            id: item.snippet.channelId,
            imagem: item.snippet.thumbnails.default.url
        }));

        res.json(canais);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// funcao de ir para outra pagina
async function carregarDados(user, key) {

    if (!user) {
        return res.status(400).json({ error: 'O ID do canal é necessário.' });
    }

    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings,contentDetails&id=${user}&key=${key}`;

    const response = await fetch(url);

    if (!response.ok) throw new Error("Erro na requisição ao buscar dados do canal.");

    const conta = await response.json();

    return (conta); 
}

router.get('/profile', async (req, res) => {
    try {
        const { user } = req.query;

        if (!user) {
            return res.status(400).json({ error: 'O ID do canal é necessário.' });
        }

        const key = process.env.YOUTUBE_PUBLIC_KEY;

        const conta = await carregarDados(user, key);

        const playlistId = conta.items[0].contentDetails.relatedPlaylists.uploads;
        const url2 = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=10&key=${key}`;

        const response2 = await fetch(url2);

        if (!response2.ok) throw new Error("Erro na requisição ao buscar thumbnails.");

        const data = await response2.json();

        const thumbnails = data.items.map(item => item.snippet.thumbnails.medium.url);

        res.json({ conta: conta.items[0], thumbnails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

//Caminho do arquivo JSON dos usuários
const caminhoJson = path.join(__dirname, '../json/usuarios.json');

//Função pra atualizar o arquivo JSON (com as contas do youtube)
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

function salvarUsuarios(usuarios) {

    //Salva o arquivo com o conteudo atual, formatando os objetos para o arquivo json
    fs.writeFileSync(caminhoJson, JSON.stringify(usuarios, null, 2), 'utf8');
}

function encontrarIndices(userId, contaId) {
    // Carrega os usuários do JSON
    const usuarios = carregarUsuarios();

    // Encontra o índice do usuário com o ID especificado
    const userIndex = usuarios.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return { erro: 'Usuário não encontrado', userIndex: null, youtubeIndex: null };
    }

    // Se uma conta foi especificada, encontra o índice da conta
    let youtubeIndex = null;
    if (contaId !== undefined) {
        youtubeIndex = usuarios[userIndex].redes.youtube.findIndex(c => c.id === Number(contaId));

        if (youtubeIndex === -1) {
            youtubeIndex = usuarios[userIndex].redes.youtube.findIndex(c => c.nome === contaId);

            if (youtubeIndex === -1) {
                return { erro: 'Conta do YouTube não encontrada', userIndex, youtubeIndex: null };
            }
        }
    }

    return { erro: null, userIndex,  youtubeIndex};
}


// Função para atualizar ou adicionar os dados do YouTube
function atualizarUsers(nome, id, userId, token, refreshToken, foto, expires) {
    // Carrega os usuários existentes
    let usuarios = carregarUsuarios();


    // Encontra o usuário com o ID especificado
    const userIndex = usuarios.findIndex(u => u.id === userId);

    if (userIndex !== -1) {

        // Verifica se o ID do YouTube já foi cadastrado
        const youtubeExiste = usuarios[userIndex].redes.youtube.find(account => account.conta === id);

        if (youtubeExiste) {
            return { sucesso: false, mensagem: "Conta do YouTube já cadastrada" };
        }

        let idConta;

        // Verifica se o array de contas do YouTube está vazio
        if (usuarios[userIndex].redes.youtube.length > 0) {
            // Se não estiver vazio, pega o idConta do último item e adiciona 1
            idConta = usuarios[userIndex].redes.youtube[usuarios[userIndex].redes.youtube.length - 1].id + 1;
        } else {
            // Se estiver vazio, começa o idConta como 1
            idConta = 1;
        }

        // Adiciona a nova conta do YouTube
        usuarios[userIndex].redes.youtube.push({ id: idConta, nome, conta: id, token, refreshToken, foto, expiresIn: expires });

    } else {
        // Se o usuário não for encontrado, retorna erro
        console.warn(`Usuário com ID ${userId} não encontrado.`);
        return { sucesso: false, mensagem: "Usuário não encontrado" };
    }

    // Salva os dados atualizados no arquivo JSON
    salvarUsuarios(usuarios);

    return { sucesso: true };
}

// Função para validar token com base na validade
async function validarToken(usuarios, userId, contaId) {
    // Encontrar índices usando a função genérica
    const { erro, userIndex, youtubeIndex } = encontrarIndices( userId, contaId);

    if (erro) {
        throw new Error(erro); // Lança um erro para o chamador lidar
    }

    const conta = usuarios[userIndex].redes.youtube[youtubeIndex];

    // Verificar validade do token
    const agora = new Date().getTime();
    if (conta.expiresIn && conta.expiresIn > agora) {
        return conta.token; // Retorna o token válido
    }

    // Se o token expirou, atualiza-o usando o refreshToken
    if (conta.refreshToken) {
        const novoToken = await atualizarToken(conta.refreshToken);

        // Atualizar o objeto com o novo token e validade
        usuarios[userIndex].redes.youtube[youtubeIndex].token = novoToken.accessToken;
        usuarios[userIndex].redes.youtube[youtubeIndex].expiresIn = novoToken.expires_in;

        salvarUsuarios(usuarios);

        return novoToken.accessToken; // Retorna o novo token válido
    }

    throw new Error("Token expirado e não há refreshToken disponível");
}

async function atualizarToken(refreshToken) {
    const url = "https://oauth2.googleapis.com/token";
    const params = new URLSearchParams({
        client_id: process.env.YOUTUBE_CLIENT_ID,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token"
    });

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString()
    });

    if (!response.ok) {
        throw new Error("Erro ao atualizar o token");
    }

    const data = await response.json();

    return {
        accessToken: data.access_token,
        expires_in: new Date().getTime() + data.expires_in * 1000 // Adiciona o tempo em milissegundos
    };
}



// URL para autorizar o usuário
router.get("/adicionarConta", (req, res) => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
        client_id: process.env.YOUTUBE_CLIENT_ID,
        redirect_uri: process.env.YOUTUBE_CLIENT_REDIRECT,
        response_type: "code",
        scope: "https://www.googleapis.com/auth/youtube",
        access_type: "offline",
        prompt: "consent",
    }).toString()}`;
    res.redirect(authUrl);
});

// Callback do OAuth2
router.get("/youtubeCallback", async (req, res) => {
    const code = req.query.code;

    try {
        // Trocar o código pelo token de acesso
        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", null, {
            params: {
                code,
                client_id: process.env.YOUTUBE_CLIENT_ID,
                client_secret: process.env.YOUTUBE_CLIENT_SECRET,
                redirect_uri: process.env.YOUTUBE_CLIENT_REDIRECT,
                grant_type: "authorization_code",
            },
        });

        const tokens = tokenResponse.data;
        req.session.tokens = tokens;

        // Buscar informações do canal do YouTube
        const youtubeResponse = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
            params: {
                part: "snippet,brandingSettings",
                mine: true,
            },
        });

        const items = youtubeResponse.data.items;

        if (!items || items.length === 0) {
            console.warn("Nenhum canal encontrado para esta conta.");
            return res.redirect("/?error=SemCanaisEncontrados");
        }

        const channel = items[0];

        const userId = channel.id;
        const nome = channel.snippet.title;
        const foto = channel.snippet.thumbnails.default.url;
        expira = new Date().getTime() + tokens.expires_in * 1000;

        atualizarUsers(nome, userId, req.session.userId, tokens.access_token, tokens.refresh_token, foto, expira);

        // Redireciona para a página inicial
        res.redirect("/menu.html");
    } catch (error) {
        console.error("Erro ao autenticar:", error.message);
        res.redirect("/menu.html?error=AuthFailed");
    }
});

router.get("/removerConta", async (req, res) => {
    try {
        const idUser  = req.session.userId;
        const { id } = req.query;

        if (!idUser ) {
            return res.status(401).send('Usuário não está autenticado');
        }

        let usuarios = carregarUsuarios();

        if (!usuarios || usuarios.length === 0) {
            return res.status(404).send('Nenhum usuário encontrado');
        }

        const { erro, userIndex, youtubeIndex } = encontrarIndices(idUser, id);

        if (erro) {
            return res.status(404).send(erro);
        }


        const token = usuarios[userIndex].redes.youtube[youtubeIndex].refreshToken;
        await revogarToken(token);

        usuarios[userIndex].redes.youtube.splice(youtubeIndex, 1);

        salvarUsuarios(usuarios);

        res.send('Conta removida com sucesso');
    } catch (error) {
        console.error('Erro ao remover conta:', error);
        res.status(500).send('Erro interno ao processar a solicitação');
    }
});

async function revogarToken(token) {
    try {
        const response = await axios.post(
            `https://oauth2.googleapis.com/revoke?token=${token}`,
            null,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        if (response.status == 200) {
            console.log('Acesso revogado com sucesso.');
        } else {
            console.log('Falha ao revogar acesso:', response.status, response.data);
        }
    } catch (error) {
        console.error('Erro ao revogar o token:', error.message);
    }
}

async function pegarPlaylists(usuarios, userId, contaId) {
    try {
        // Validar token
        const token = await validarToken(usuarios, userId, contaId);

        // Requisição para a API do YouTube para obter as playlists
        const response = await fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=10", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar playlists: " + response.statusText);
        }

        const data = await response.json();

        return data.items.map(playlist => ({
            titulo: playlist.snippet.title,
            descricao: playlist.snippet.description,
            thumbnails: playlist.snippet.thumbnails
        }));
    } catch (error) {
        console.error(error);
        throw new Error("Erro ao obter playlists: " + error.message);
    }
}


router.get("/myprofile", async (req, res) => {
    const { user } = req.query;
    const userId = req.session.userId;

    try {
        const { erro, userIndex, youtubeIndex } = encontrarIndices(userId, user);

        if (erro) {
            return res.status(404).send(erro);
        }

        const usuarios = carregarUsuarios();

        const conta = usuarios[userIndex].redes.youtube[youtubeIndex].conta;

        const key = process.env.YOUTUBE_PUBLIC_KEY;

        const data = await carregarDados(conta, key);

        const playlists = await pegarPlaylists(usuarios, userId, user);

        res.json({data: data.items[0], playlists});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;