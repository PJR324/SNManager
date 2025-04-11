const express = require('express');
const router = express.Router();

let twitchToken; // Token atual
let tokenExpira; // Timestamp de expiração do token

// Função para obter ou reutilizar o token de acesso da Twitch
async function getAccessToken() {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;

    // Verifica se o token atual ainda é válido
    if ((twitchToken && tokenExpira) && (Date.now() < tokenExpira)) {
        return twitchToken; // Retorna o token atual se ainda for válido
    }

    // Solicita um novo token
    const url = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;

    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();

    // Armazena o token e calcula a data de expiração
    twitchToken = data.access_token;
    tokenExpira = Date.now() + data.expires_in * 1000; // `expires_in` é em segundos

    console.log("Novo token gerado:", twitchToken);

    return twitchToken;
}

router.get('/search', async (req, res) => {
    try {
        const { user } = req.query;

        if (!user) {
            return res.status(400).json({ error: 'O nome do perfil é necessário.' });
        }

        const clientId = process.env.TWITCH_CLIENT_ID;
        const token = await getAccessToken();

        const url = `https://api.twitch.tv/helix/search/channels?query=${encodeURIComponent(user)}&first=7`; // Retorna os 5 primeiros resultados

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.data.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado!' });
        }

        const perfis = data.data.map(item => ({
            nome: item.display_name,
            id: item.id,
            imagem: item.thumbnail_url
        }));

        res.json(perfis);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/profile', async (req, res) => {
    try {

        const userId = req.query.id;

        if (!userId) {
            return res.status(400).json({ error: 'ID do usuário é obrigatório!' });
        }

        const clientId = process.env.TWITCH_CLIENT_ID;
        const token = await getAccessToken();

        const url = `https://api.twitch.tv/helix/users?id=${userId}`;

        const response = await fetch(url, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log(data.data[0])
        res.json(data.data[0]); // Retorna os dados do usuário
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar dados do usuário!' });
    }
})

module.exports = router;