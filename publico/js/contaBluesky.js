// Adiciona evento para carregar os dados do perfil assim que a página estiver totalmente carregada
document.addEventListener("DOMContentLoaded", carregarConta);

// Função principal para carregar informações do perfil do usuário
async function carregarConta() {
    // Mostra o loader
    mostrarLoader();

    try {

        const handle = localStorage.getItem("selectedAccount"); // Recupera o identificador do usuário selecionado

        // Verifica se os dados do usuário já estão armazenados no localStorage
        const cachedUser = localStorage.getItem("currentAccount"); // Último usuário acessado
        const cachedData = localStorage.getItem("cachedProfileData"); // Dados armazenados previamente

        if ((cachedUser === handle) && (cachedData)) {
            // Se o handle coincide com o usuário atual, utiliza os dados do cache
            const { conta, posts } = JSON.parse(cachedData);
            exibirPerfil(conta, posts);
        } else {
            // Caso contrário, realiza uma requisição para obter os dados do usuário
            const { conta, posts } = await carregarDados(handle);

            if (conta && posts) {
                // Armazena os dados no localStorage para otimizar futuras solicitações
                localStorage.setItem("cachedProfileData", JSON.stringify({ conta, posts }));
                localStorage.setItem("currentAccount", handle);
                exibirPerfil(conta, posts); // Exibe os dados carregados
            }
        }
    } catch(error) {
        console.error("Erro ao carregar conta:", error); // Loga o erro no console
    } finally {
        esconderLoader(); // Esconde o spinner ao terminar a execução
    }
}

function mostrarLoader() {
    const loader = document.getElementById("loaderBox");
    loader.style.display = "flex";
}

function esconderLoader() {
    const loader = document.getElementById("loaderBox");
    loader.style.display = "none";
}

// Função para realizar a requisição e obter os dados do perfil
async function carregarDados(handle) {
    try {
        // Envia uma requisição GET para buscar os dados do perfil
        const resposta = await fetch(`/bluesky/profile?handle=${handle}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!resposta.ok) {
            throw new Error("Erro na requisição"); // Lança um erro se a resposta não for bem-sucedida
        }

        return await resposta.json(); // Retorna os dados do perfil em formato JSON
    } catch (error) {
        console.error('Erro ao buscar perfil:', error); // Loga o erro no console
        return {}; // Retorna um objeto vazio em caso de erro
    }
}

// Função para exibir os dados do perfil e os posts do usuário
function exibirPerfil(conta, posts) {
    if (conta) {
        const fotoPerfil = document.getElementById("fotoPerfil");
        const cabecalho = document.getElementById("cabecalho");

        // Atualiza a imagem de perfil
        const img = document.createElement("img");
        img.src = conta.avatar;
        fotoPerfil.innerHTML = ''; // Limpa qualquer conteúdo anterior
        fotoPerfil.appendChild(img);

        // Define o banner como background do cabeçalho
        cabecalho.style.backgroundImage = `linear-gradient(to top, #000000, transparent), url('${conta.banner}')`;
        document.getElementById("nomeUsuario").textContent = conta.displayName; // Define o nome do usuário

        carregarPosts(posts); // Exibe os posts do usuário
    }
}

// Função para exibir os posts carregados do perfil do usuário
function carregarPosts(posts) {
    const conteudoDiv = document.getElementById("conteudo");
    conteudoDiv.innerHTML = ''; // Limpa os posts anteriores

    // Itera sobre os posts e cria os elementos para exibição
    posts.forEach(post => {
        const article = document.createElement("article");
        article.classList.add("postagem");

        // Cria a estrutura do conteúdo do post
        const postContentDiv = document.createElement("div");
        postContentDiv.classList.add("postagemContent");

        const postContentInnerDiv = document.createElement("div");
        postContentInnerDiv.classList.add("postagemContentInner");

        const conteudoSpan = document.createElement("span");
        conteudoSpan.textContent = post.post.record.text; // Adiciona o texto do post
        postContentInnerDiv.appendChild(conteudoSpan);

        // Verifica e renderiza o conteúdo adicional (imagens ou vídeos)
        if (post.post.embed) {
            const typePost = post.post.embed;

            if (typePost.$type === "app.bsky.embed.images#view") {
                // Adiciona imagens ao post
                typePost.images.forEach(imagem => {
                    const mediaElement = document.createElement("img");
                    mediaElement.src = imagem.thumb;
                    mediaElement.alt = imagem.alt;
                    postContentInnerDiv.appendChild(mediaElement);
                });
            } else if (typePost.$type === "app.bsky.embed.video#view") {
                // Adiciona vídeo ao post
                const img = document.createElement("img");
                img.src = typePost.thumbnail;

                postContentInnerDiv.appendChild(img);
            }
        }

        postContentDiv.appendChild(postContentInnerDiv);
        article.appendChild(postContentDiv);

        // Adiciona estatísticas (comentários, reposts e likes)
        const statsDiv = document.createElement("div");
        statsDiv.innerHTML = `
            <span>Comentários: ${post.post.replyCount}</span>
            <span>Reposts: ${post.post.repostCount}</span>
            <span>Likes: ${post.post.likeCount}</span>
        `;
        article.appendChild(statsDiv);

        // Adiciona o rodapé com a data de postagem
        const footer = document.createElement("footer");
        footer.textContent = `Postado em ${new Date(post.post.record.createdAt).toLocaleString()}`;
        article.appendChild(footer);

        conteudoDiv.appendChild(article); // Adiciona o post ao container principal
    });
}
