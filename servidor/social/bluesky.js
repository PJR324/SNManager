const express = require('express');
const router = express.Router();

router.get('/search', async (req, res) => {
    const { handle } = req.query;

    if (!handle) {
        return res.status(400).json({ error: 'O nome de usuário é necessário.' });
    }

    try {

        const url = `https://public.api.bsky.app/xrpc/app.bsky.actor.searchActorsTypeahead?term=${handle}&limit=7`;

        const data = await fetch(url);

        const response = await data.json();

        const users = response.actors.slice(0, 7).map(user => ({
            handle: user.handle,
            avatar: user.avatar
        }));

        res.json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários no Bluesky:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
});

router.get('/profile', async (req, res) => {
    
    const { handle } = req.query;

    if (!handle) {
        return res.status(400).json({ error: 'O domínio do usuário é necessário.' });
    }

    try {

        const url = `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${handle}`;

        // Busca o perfil pelo domínio
        const data = await fetch(url);

        const response = await data.json();

        const conta = {
            displayName: response.displayName,
            handle: response.handle,
            avatar: response.avatar,
            banner: response.banner,
            did: response.did,
        };

        const url2 = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${handle}&filter=posts_with_media&limit=10`;

        const data2 = await fetch(url2);
    
        const response2 = await data2.json();

        const posts = response2.feed;

        res.json({conta, posts});
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ error: 'Erro ao buscar perfil.' });
    }
});


module.exports = router;