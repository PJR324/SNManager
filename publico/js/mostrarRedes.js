async function carregarConta(conta, playlists, user) {
    console.log(playlists);
    const main = document.getElementById("main");
    let conteudo;

    if (!document.getElementById("conteudo")) {
        conteudo = document.createElement("section");
        conteudo.id = "conteudo";
    }
    else {
        conteudo = document.getElementById("conteudo");
        conteudo.innerHTML = '';
    }
    
    if (conta.brandingSettings?.image?.bannerExternalUrl) {
        const div = document.createElement("div");
        div.id = "bannerYoutube";
        div.style.backgroundImage = `url('${conta.brandingSettings.image.bannerExternalUrl}')`;
        conteudo.appendChild(div);
    }

    const h2 = document.createElement("h2");
    h2.id = "userName";
    h2.textContent = conta.brandingSettings.channel.title;

    //Cria a parte de dados básicos do canal
    const inscritos = document.createElement("span");
    const videos = document.createElement("span");
    const views = document.createElement("span");

    inscritos.textContent = "Inscritos: " + conta.statistics.subscriberCount;
    videos.textContent = "Vídeos: " + conta.statistics.videoCount;
    views.textContent = "Views: " + conta.statistics.viewCount;

    const divTexto = document.createElement("div");
    divTexto.id = "canalInfo";

    divTexto.appendChild(inscritos);
    divTexto.appendChild(videos);
    divTexto.appendChild(views);

    //Cria a descrição do canal
    const descricaoDiv = document.createElement("div");
    descricaoDiv.id = "youtubeDescricao";
    const descricao = document.createElement("span");
    descricao.textContent = conta.snippet.description;
    descricaoDiv.appendChild(descricao);

    //Cria a parte das playlists do canal
    const playlistsH1 = document.createElement("h1");
    playlistsH1.textContent = "Playlists";
    playlistsH1.id = "tituloPlaylists";

    const playlistsBox = document.createElement("article");
    playlistsBox.id = "playlistsBox";

    playlists.slice(0, 10).forEach(playlist => {
        const section = document.createElement("section");
        section.classList.add("playlistBox");

        const img = document.createElement("img");
        img.src = playlist.thumbnails.standard.url;

        const txt = document.createElement("span");
        txt.textContent = playlist.titulo;
        txt.id = "youtubePlaylistTitulo";

        const txt2 = document.createElement("span");
        txt2.textContent = playlist.descricao;
        txt2.id = "youtubePlaylistDescricao";

        section.appendChild(img);
        section.appendChild(txt);
        section.appendChild(txt2)

        playlistsBox.appendChild(section);
    });

    //Adiciona tudo no menu
    conteudo.appendChild(h2);
    conteudo.appendChild(divTexto);
    conteudo.appendChild(descricaoDiv);
    conteudo.appendChild(playlistsH1);
    conteudo.appendChild(playlistsBox);
    main.appendChild(conteudo);
}

async function atualizarYoutube(user) {
    try {
        // Usando GET e passando o nome do usuário na URL
        const resposta = await fetch(`/youtube/myprofile?user=${user}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const {data, playlists} = await resposta.json();

        await carregarConta(data, playlists, user);

    } catch (error) {
        console.error('Erro ao buscar usuários:', error); // Tratamento de erro em caso de falha na requisição
    } finally {
        esconderLoader(); // Esconde o spinner ao terminar a execução
    }
}