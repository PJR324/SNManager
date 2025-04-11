// função para criar um modal de mensagem.
function abrirModal() {
  const modal = document.getElementById("modal"); // criando uma variável para armazenar o valor.

  modal.style.display = "flex"; //add propriedade css ao modal.

  window.addEventListener("click", (event) => { // criando o evento quando a imagem for clicada. 

    // fazendo aparecer quando o evento for "chamado".
    if (event.target == modal) {

      modal.style.display = "none";

    }

  });
}

// Função do dropdown.
function toggleDropdown(rede) {
  var dropdownList = document.getElementById("dropdown" + rede);

  // muda as propriedade da lista no css para ela aparecer e sair.
  if (dropdownList.style.display === "block") {
    dropdownList.style.display = "none";
  } else {
    dropdownList.style.display = "block";
  }

}

async function carregarDados() {
  try {
    // Faz a requisição para carregar as contas
    const resposta = await fetch("/profile");
    
    if (!resposta.ok) {
      throw new Error("Erro ao carregar as contas.");
    }

    const { conta } = await resposta.json();
    return conta; // Retorna os dados processados
  }
  catch (error) {
    console.error("Erro ao buscar dados do canal:", error); // Loga o erro no console
    return null; // Retorna valores nulos em caso de err
  }
}

async function carregarConta() {
  try {
    const dados = await carregarDados();

    if (!dados) {
      return;
    }

    redes = dados.redes;

    document.getElementById("contaSNM").innerHTML = dados.email;

    for (let i = 0; i < redes.youtube.length; i++) {
      const conta = "youtube";
      const li = document.createElement("li");

      const div = document.createElement("div");
      div.classList.add("perfilRow");

      const perfil = document.createElement("img");
      perfil.src = redes.youtube[i].foto;
    
      const txt = document.createElement("h2");
      txt.innerHTML = redes.youtube[i].nome;

      div.appendChild(perfil);
      div.appendChild(txt);

      const img = document.createElement("img");
      img.src = "img/icones/lixeira.png";
      img.id = redes.youtube[i].id;

      img.addEventListener("click", function (event) {
        modalExcluir(event.target.id, conta);
      });

      li.appendChild(div);
      li.appendChild(img);

      document.getElementById("dropdownYoutube").appendChild(li);
    }

  }
  catch (error) {
    console.error("Erro ao carregar conta:", error); // Joga o erro no console
  }

}

function modalExcluir(id, conta) {
  const modal = document.getElementById("modalLixeira"); // criando uma variável para armazenar o valor.

  modal.style.display = "flex"; //add propriedade css ao modal.

  window.addEventListener("click", (event) => { // criando o evento quando a imagem for clicada. 

    // fazendo aparecer quando o evento for "chamado".
    if (event.target == modal) {

      modal.style.display = "none";
      return;

    }

  });
  document.getElementById("botaoExcluir").addEventListener("click", async function() {
    if (conta === "youtube") {
      const resposta = await fetch(`/youtube/removerConta?id=${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!resposta.ok) {
        throw new Error("Erro ao excluir a conta.");
      }

      window.location.reload();
    }
  })

}

async function sair() {
  const resposta = await fetch('/sair', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!resposta.ok) {
    throw new Error("Erro ao carregar ao encerrar sessão.");
  }

  const resultado = await resposta.json();

  if (!resultado.sucesso) {
    return;
  }

  window.location.replace('/');
}

async function sairExcluir() {
  const resposta = await fetch('/excluirConta', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!resposta.ok) {
    throw new Error("Erro ao carregar ao encerrar sessão.");
  }

  const resultado = await resposta.json();

  if (!resultado.sucesso) {
    return;
  }

  window.location.replace('/');
}

document.addEventListener("DOMContentLoaded", carregarConta);