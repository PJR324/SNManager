//Muda pra versão mobile
function versaoMobile() {
  const sideBar = document.getElementById("sidebar");
  const menuLateral = document.getElementById("dropdownMenu");
  const box = document.createElement("article");

  while (sideBar.firstChild) {
    box.appendChild(sideBar.firstChild);
  }

  box.id = "sidebarBox";

  menuLateral.appendChild(box);

  const sanduiche = document.getElementById("settingsBox");
  sanduiche.addEventListener("click", function () {
    const botaoBox = document.getElementById("botaoBox");
    const settings = document.getElementById("settings");

    if (!botaoBox.firstChild) {

      botaoBox.appendChild(sanduiche);
    } else {

      settings.insertBefore(sanduiche, settings.firstChild);
    }
  });
}

//Função pra mudar o tipo da busca de acordo com a rede selecionada no dropdown do input de pesquisa
function atualizarConteudo(event, logo) {
  const nomeTxt = document.getElementById('pessoaNome');
  const logoIcone = document.getElementById('redeLogo');
  const box = document.getElementById('redeBox');
  const usuario = event.target.textContent;

  if (box.style.opacity == 0) {

    box.style.opacity = 1;
    
  }
  
  // Atualiza o nome e o logo da pessoa no cabeçalho
  nomeTxt.textContent = usuario //É o nome do usuario clicado;
  logoIcone.src = `img/icones/redes/${logo}_logo.png`;

  //Limpa o quadradão do centeúdo
  document.getElementById("pesquisaRow").style.display = "none";
  document.getElementById("mainContent").innerHTML = "";

  // Mostra o loader
  mostrarLoader();

  // Atualiza o conteúdo da seleção principal
  if(logo === "Youtube") {
    atualizarYoutube(usuario);
  }
  else {
    mudarSecoes(usuario);
  }
}

function pesquisaPublica() {

  const pesquisa = document.getElementById("pesquisaRow");

  if (pesquisa.style.display !== "none") {
    return;
  }

  pesquisa.style.display = "flex";
  document.getElementById("main").removeChild(document.getElementById("conteudo"));
  document.getElementById('redeBox').style.opacity = 0;
}

function mudarSecoes(nome) {
  const main = document.getElementById("main");
  
  if (!document.getElementById("conteudo")) {
    const conteudo = document.createElement("section");
    conteudo.id = "conteudo";

    main.appendChild(conteudo);
  }
  else {
    const conteudo = document.getElementById("conteudo");
    conteudo.innerHTML = '';

    conteudo.innerHTML = `<h2>Bem vindo, ${nome}.</h2>`;

    main.appendChild(conteudo);
  }
  esconderLoader();
}

//Define os eventos pra quando o usuário clicar em uma das contas
function definirEventosClique() {

  const container = document.getElementById('contasFeed');

  container.addEventListener('click', (event) => {

    if (event.target.classList.contains('contaBlueskye')) {
      atualizarConteudo(event, 'Bluesky');
    }
    else if (event.target.classList.contains('contaYoutube')) {
      atualizarConteudo(event, 'Youtube');
    }
    else if (event.target.classList.contains('contaTwitch')) {
      atualizarConteudo(event, 'Twitch');
    }
  });

}

//Aparecer o modal na tela
function abrirModal() {
  const modal = document.getElementById("modal");

  modal.style.display = "flex";

  //Fecha o modal ao clicar fora do conteúdo do modal
  window.addEventListener("click", (event) => {

    if (event.target == modal) {

      modal.style.display = "none";

    }
    
  });
}

//Responsividade
document.addEventListener("DOMContentLoaded", function() {
  if (window.innerWidth <= 700) {
      versaoMobile();
  }
});

//Função pra ver se o usuário ta logado ou não
async function checarLogin() {
  try {
    const response = await fetch('/check-login');
    const resultado = await response.json();

    if (!resultado.logado) {
      return false;
    }

    return true;

  } catch (error) {
    console.error('Erro ao verificar o status de login:', error);
  }
}

async function definirLogin() {
  const sidebar = document.getElementById("contasFeed");
  const flag = await checarLogin();

  if (!flag) {
    // Adiciona uma classe para indicar que a barra está desabilitada
    sidebar.classList.add("elementoDesabilitado");

    // Intercepta cliques nos itens da barra
    sidebar.addEventListener("click", (e) => {
      e.preventDefault(); // Impede ações normais
      alert("Você precisa estar logado para acessar essa funcionalidade.");
      window.location.href = "/entrar.html"; // Redireciona para a página de login
    });

    const perfil = document.getElementById("perfilLink");
    perfil.classList.add("elementoDesabilitado");
    perfil.addEventListener("click", (e) => {
      e.preventDefault(); // Impede ações normais
      alert("Você precisa estar logado para acessar essa funcionalidade.");
      window.location.href = "/entrar.html"; // Redireciona para a página de login
    });

  } else {
    carregarPessoas(); // Carrega as contas para a sidebar
  }
}

async function carregarPessoas() {
  const sidebar = document.getElementById("contasFeed");

  try {
    // Faz a requisição para carregar as contas
    const resposta = await fetch("/carregarContas");
    
    if (!resposta.ok) {
      throw new Error("Erro ao carregar as contas.");
    }

    const { contas } = await resposta.json();

    // Carrega as contas de Bluesky, Twitch e YouTube
    preencherContasNaSidebar("bluesky", contas.bluesky);
    preencherContasNaSidebar("twitch", contas.twitch);
    preencherContasNaSidebar("youtube", contas.youtube);
  } catch (erro) {
    console.error("Erro ao carregar as contas:", erro);
  }
}

function preencherContasNaSidebar(classe, contas) {
  // Encontra a seção correspondente à rede (Bluesky, Twitch ou YouTube)
  const section = document.querySelector(`#${classe}Checkbox`).closest('article').querySelector('.contasMenu');
  
  // Adiciona as novas contas
  if (contas && contas.length > 0) {
    contas.forEach(conta => {
      const contaElement = document.createElement("a");
      contaElement.href = "#";
      contaElement.classList.add(`conta${capitalize(classe)}`);
      contaElement.textContent = conta.nome;
      
      section.insertBefore(contaElement, section.firstChild);
    });
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}



// Executa a função
document.addEventListener('DOMContentLoaded', () => {
  definirLogin();
  definirEventosClique();
});

function ativarDropdown() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.position = dropdown.style.position === "relative" ? "static" : "relative";

  const dropdownContent = document.getElementById("dropdownContent");
  dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";

}

function selectImage(redeId) {
  const rede = redeId.split("_")[1];
  document.getElementById("imagemSelecionada").src = `img/icones/redes/${rede}_logo.png`;
  document.getElementById("inUser").placeholder = rede;
  document.getElementById("dropdownContent").style.display = "none";
  document.getElementById("dropdown").style.position = "static";

}

// Alternar tema ao clicar no botão
document.getElementById("menuTemas").addEventListener('click', () => {
  const isDarkMode = (localStorage.getItem('dark-mode')) ? true : false;;
  if (isDarkMode) {
      applyLightTheme();
      localStorage.removeItem('dark-mode');
      updateMascotImages(false);
      updateSanduiche(false);
  } else {
      applyDarkTheme();
      localStorage.setItem('dark-mode', 'true');
      updateMascotImages(true);
      updateSanduiche(true);
  }
});

//Função pra identificar se o dropdown das redes no input ta aberto ou não 
//(O dropdown buga na versão mobile quando a sidebar abre)
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("dropdown");

  //Só continua a função se o dropdown existir (estiver na página)
  if (!dropdown) {
    return;
  }
  
  const dropdownContent = document.getElementById("dropdownContent");

  //Se o lugar clicado for fora do dropdown, deixa o dropdown com position normal pra n bugar
  if (!dropdown.contains(event.target)) {
      dropdownContent.style.display = "none";
      dropdown.style.position = "static";
  }
});