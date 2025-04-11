// Aguarda o carregamento completo da página antes de iniciar o processo
document.addEventListener("DOMContentLoaded", carregarConta);

// Função principal para carregar os dados da conta do YouTube
async function carregarConta() {
    // Mostra o loader
    mostrarLoader();

    try {
        // Recupera o identificador da conta selecionada no localStorage
        const user = localStorage.getItem("selectedAccount");

        let conta, thumbnails;

        // Verifica se os dados do usuário atual estão armazenados no cache
        const cachedUser = localStorage.getItem("currentAccount"); // Último usuário processado
        const cachedData = localStorage.getItem("cachedProfileData"); // Dados armazenados

        if (cachedUser === user && cachedData) {
            // Se o usuário atual coincide com o cache, utiliza os dados armazenados
            ({ conta, thumbnails } = JSON.parse(cachedData));
        } else {
            // Caso contrário, realiza uma nova requisição para obter os dados
            ({ conta, thumbnails } = await carregarDados(user));

            if (conta && thumbnails) {
                // Atualiza o cache com os novos dados
                localStorage.setItem("cachedProfileData", JSON.stringify({ conta, thumbnails }));
                localStorage.setItem("currentAccount", user);
            }
        }

        // Exibe os dados do perfil se a conta for válida
        if (conta) {
            const fotoPerfil = document.getElementById("fotoPerfil");
            const cabecalho = document.getElementById("cabecalho");
            const conteudo = document.getElementById("conteudo");

            // Exibe a foto de perfil
            const imgPerfil = document.createElement("img");
            imgPerfil.src = conta.snippet.thumbnails.default.url;
            fotoPerfil.innerHTML = ''; // Limpa qualquer conteúdo existente
            fotoPerfil.appendChild(imgPerfil);

            // Define o banner como background do cabeçalho
            cabecalho.style.backgroundImage = `linear-gradient(to top, #000000, transparent), url('${conta.brandingSettings.image.bannerExternalUrl}')`;
            document.getElementById("nomeUsuario").textContent = conta.snippet.title; // Define o nome do canal

            // Exibe as miniaturas dos vídeos no conteúdo principal
            conteudo.innerHTML = ''; // Limpa os dados existentes
            thumbnails.slice(0, 10).forEach(thumbnailUrl => {
                const img = document.createElement("img");
                img.src = thumbnailUrl;

                const box = document.createElement("section");
                box.classList.add("postagem");
                box.appendChild(img);

                conteudo.appendChild(box);
            });
        }
    } catch (error) {
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

// Função para carregar os dados do usuário via requisição
async function carregarDados(userId) {
    try {
        // Realiza a requisição GET para obter os dados do perfil
        const resposta = await fetch(`/youtube/profile?user=${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!resposta.ok) {
            throw new Error("Erro na requisição"); // Lança erro se a resposta não for bem-sucedida
        }

        // Extrai os dados do perfil e as miniaturas da resposta
        const { conta, thumbnails } = await resposta.json();
        return { conta, thumbnails }; // Retorna os dados processados
    } catch (error) {
        console.error("Erro ao buscar dados do canal:", error); // Loga o erro no console
        return { conta: null, thumbnails: null }; // Retorna valores nulos em caso de erro
    }
}
