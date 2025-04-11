document.addEventListener("DOMContentLoaded", carregarConta);

async function carregarConta() {
    // Mostra o loader
    mostrarLoader();

    try {

        const id = localStorage.getItem("selectedAccount");
        
        if (!id) {
            console.error("Nenhuma conta selecionada.");
            return;
        }

        const cachedUser = localStorage.getItem("currentAccount");
        const cachedData = localStorage.getItem("cachedProfileData");

        if (cachedUser === id && cachedData) {
            const conta = JSON.parse(cachedData).conta;
            exibirPerfil(conta);
        } else {
            const conta = await carregarDados(id);
            if (conta) {
                localStorage.setItem("cachedProfileData", JSON.stringify({ conta }));
                localStorage.setItem("currentAccount", id);
                exibirPerfil(conta);
            }
        }
    } catch (error) {
        console.error("Erro ao carregar conta:", error); // Loga o erro no console
    } finally {
        esconderLoader(); // Esconde o spinner ao terminar a execução
    }
}

async function carregarDados(id) {
    try {
        const resposta = await fetch(`/twitch/profile?id=${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!resposta.ok) {
            throw new Error("Erro na requisição");
        }

        return await resposta.json();
    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        return null;
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

function exibirPerfil(conta) {
    if (!conta) return;

    console.log(conta);
    const fotoPerfil = document.getElementById("fotoPerfil");
    const cabecalho = document.getElementById("cabecalho");

    // Atualiza a imagem de perfil
    const img = document.createElement("img");
    img.src = conta.profile_image_url;
    fotoPerfil.innerHTML = '';
    fotoPerfil.appendChild(img);

    // Define o banner como background do cabeçalho
    if (conta.offline_image_url) {
        cabecalho.style.backgroundImage = `linear-gradient(to top, #000000, transparent), url('${conta.offline_image_url}')`;
    }

    document.getElementById("nomeUsuario").textContent = conta.display_name;
}
