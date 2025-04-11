// Adiciona evento ao formulário para iniciar a busca ao ser enviado
document.getElementById("pesquisaRow").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    // Captura o input do usuário e desativa o foco
    const userInput = document.getElementById("inUser");

    if (userInput.value === "") {
        return; // Se o campo estiver vazio, encerra a função
    }

    userInput.blur(); // Remove o foco do input após o valor ser capturado

    // Obtém o nome do usuário a ser buscado e a rede social selecionada
    const userBuscado = userInput.value;
    let rede = document.querySelector("#imagemSelecionadaBox img").src.split("/");
    rede = rede[rede.length - 1].split("_")[0]; // Extrai o nome da rede a partir da imagem selecionada

    const main = document.getElementById("mainContent");
    main.innerHTML = ''; // Limpa o conteúdo anterior

    // Mostra o loader
    mostrarLoader();

    // Chama a função de busca correspondente à rede social
    if (rede === "Bluesky") {
        buscarBluesky(userBuscado);
    } else if (rede === "Youtube") {
        buscarYoutube(userBuscado);
    } else if (rede === "Twitch") {
        buscarTwitch(userBuscado);
    }
});

function mostrarLoader() {
    const loader = document.getElementById("loader");
    loader.style.display = "block";
}

function esconderLoader() {
    const loader = document.getElementById("loader");
    loader.style.display = "none";
}

// Função para busca no Bluesky
async function buscarBluesky(user) {

    try {
        // Usando GET e passando o nome do usuário na URL
        const resposta = await fetch(`/bluesky/search?handle=${user}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await resposta.json();

        if (resposta.ok) {
            exibirUsuarios(data); // Chama a função para exibir os usuários na tela
        } else {
            console.error('Erro ao exibir usuários:');
        }
        
    } catch (error) {
        console.error('Erro ao buscar usuários:', error); // Tratamento de erro em caso de falha na requisição
    } finally {
        esconderLoader(); // Esconde o spinner ao terminar a execução
    }

    function exibirUsuarios(usuarios) {

        const main = document.getElementById("mainContent");

        // Itera pelos canais e cria elementos HTML para exibição
        usuarios.forEach((usuario, index) => {
            // Cria estrutura do artigo para exibir informações do canal
            const container = document.createElement("article");
            container.classList.add("contaRow");

            // Cria elementos de imagem e título
            const box = document.createElement("div");
            const titulo = document.createElement("h2");
            titulo.textContent = usuario.handle; // Adiciona o handle do usuário

            const imagem = document.createElement("img");
            imagem.src = usuario.avatar; // Define a URL do avatar do usuário

            // Configura link para a página do canal com evento de armazenamento
            const a = document.createElement("a");
            a.href = 'contaBluesky.html'; // Link para a página de perfil
            a.id = `conta${index}`; // Adiciona um ID único ao link

            const h2 = document.createElement("h2");
            h2.innerHTML = "Ver perfil"; // Texto do link

            // Monta o HTML e anexa os elementos
            box.appendChild(imagem);
            box.appendChild(titulo);
            a.appendChild(h2);
            container.appendChild(box);
            container.appendChild(a);

            // Evento para salvar o ID do canal selecionado no localStorage
            a.addEventListener("click", function () {
                localStorage.setItem("selectedAccount", usuario.handle); // Salva o handle no localStorage
            });

            main.appendChild(container); // Adiciona o container principal ao DOM
        });

    }
}

// Função para buscar usuários no YouTube
async function buscarYoutube(user) {

    try {
        // Faz a requisição para o endpoint do YouTube passando o nome do usuário
        const resposta = await fetch(`/youtube/search?user=${user}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const canais = await resposta.json();


        // Exibe os canais na página
        exibirCanais(canais);

    } catch (error) {
        console.error("Erro ao buscar canais:", error); // Tratamento de erro
    } finally {
        esconderLoader(); // Esconde o spinner ao terminar a execução
    }

    // Função para exibir os canais encontrados na página
    function exibirCanais(canais) {

        const main = document.getElementById("mainContent");

        // Itera pelos canais e cria elementos HTML para exibição
        canais.forEach((canal, index) => {
            // Cria estrutura do artigo para exibir informações do canal
            const container = document.createElement("article");
            container.classList.add("contaRow");

            // Cria elementos de imagem e título
            const box = document.createElement("div");
            const titulo = document.createElement("h2");
            titulo.textContent = canal.nome; // Nome do canal

            const imagem = document.createElement("img");
            imagem.src = canal.imagem; // Imagem do canal

            // Configura link para a página do canal com evento de armazenamento
            const a = document.createElement("a");
            a.href = 'contaYoutube.html'; // Link para a página de detalhes
            a.id = `conta${index}`; // ID único para o link

            const h2 = document.createElement("h2");
            h2.innerHTML = "Ver perfil"; // Texto do link

            // Monta o HTML e anexa os elementos
            box.appendChild(imagem);
            box.appendChild(titulo);
            a.appendChild(h2);
            container.appendChild(box);
            container.appendChild(a);

            // Evento para salvar o ID do canal selecionado no localStorage
            a.addEventListener("click", function () {
                localStorage.setItem("selectedAccount", canal.id); // Salva o ID no localStorage
            });

            main.appendChild(container); // Adiciona o container principal ao DOM
        });

    }
}

// Função para busca na Twitch
async function buscarTwitch(user) {
    try {
        // Faz a requisição para o endpoint da Twitch passando o nome do usuário
        const resposta = await fetch(`/twitch/search?user=${user}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const perfis = await resposta.json();


        // Exibe os canais na página
        exibirPerfis(perfis);

    } catch (error) {
        console.error("Erro ao buscar canais:", error); // Tratamento de erro
    } finally {
        esconderLoader(); // Esconde o spinner ao terminar a execução
    }

    function exibirPerfis(perfis) {

        const main = document.getElementById("mainContent");

        console.log(perfis);
        // Itera pelos perfis e cria elementos HTML para exibição
        perfis.forEach((usuario, index) => {
            // Cria estrutura do artigo para exibir informações do perfil
            const container = document.createElement("article");
            container.classList.add("contaRow");

            // Cria elementos de imagem e título
            const box = document.createElement("div");
            const titulo = document.createElement("h2");
            titulo.textContent = usuario.nome; // Adiciona o handle do usuário

            const imagem = document.createElement("img");
            imagem.src = usuario.imagem; // Define a URL do avatar do usuário

            // Configura link para a página do canal com evento de armazenamento
            const a = document.createElement("a");
            a.href = 'contaTwitch.html'; // Link para a página de perfil
            a.id = `conta${index}`; // Adiciona um ID único ao link

            const h2 = document.createElement("h2");
            h2.innerHTML = "Ver perfil"; // Texto do link

            // Monta o HTML e anexa os elementos
            box.appendChild(imagem);
            box.appendChild(titulo);
            a.appendChild(h2);
            container.appendChild(box);
            container.appendChild(a);

            // Evento para salvar o ID do canal selecionado no localStorage
            a.addEventListener("click", function () {
                localStorage.setItem("selectedAccount", usuario.id); // Salva o handle no localStorage
            });

            main.appendChild(container); // Adiciona o container principal ao DOM
        });

    }
}
