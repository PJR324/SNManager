// Função para aplicar as variáveis do modo escuro
function applyDarkTheme() {
    const root = document.documentElement;
    root.style.setProperty('--back', '#e8e7e7');
    root.style.setProperty('--backDark', '#121212');
    root.style.setProperty('--backDark2', '#b5b6b6');
    root.style.setProperty('--backDark3', '#908c85');
    root.style.setProperty('--backDark4', '#333333');
    root.style.setProperty('--backDark5', '#0e0e0e');
    root.style.setProperty('--backDark6', '#717273');
    root.style.setProperty('--backDark7', '#666463');
    root.style.setProperty('--textDark', '#b34436');
    root.style.setProperty('--textDark2', '#e8e7e7');
    root.style.setProperty('--backClear', '#e8e7e7');
    root.style.setProperty('--backClear1', '#ccc');
    root.style.setProperty('--backClear3', '#dee4e5');
    root.style.setProperty('--backClear5', '#fff8f8');
    root.style.setProperty('--backClear6', '#9cabae');
    root.style.setProperty('--backClear7', '#fff8f8');
    root.style.setProperty('--textClear', '#121212');
    root.style.setProperty('--textClear2', '#121212');
}

// Função para aplicar as variáveis do modo claro
function applyLightTheme() {
    const root = document.documentElement;
    root.style.setProperty('--back', '#e8e7e7');
    root.style.setProperty('--backDark', '#ccc');
    root.style.setProperty('--backDark2', '#b5b6b6');
    root.style.setProperty('--backDark3', '#dee4e5');
    root.style.setProperty('--backDark4', '#333333');
    root.style.setProperty('--backDark5', '#fff8f8');
    root.style.setProperty('--backDark6', '#9cabae');
    root.style.setProperty('--backDark7', '#fff8f8');
    root.style.setProperty('--textDark', '#121212');
    root.style.setProperty('--textDark2', '#121212');
    root.style.setProperty('--backClear', '#121212');
    root.style.setProperty('--backClear1', '#ebddcc');
    root.style.setProperty('--backClear3', '#908c85');
    root.style.setProperty('--backClear5', '#0e0e0e');
    root.style.setProperty('--backClear6', '#717273');
    root.style.setProperty('--backClear7', '#666463');
    root.style.setProperty('--textClear', '#b34436');
    root.style.setProperty('--textClear2', '#e8e7e7');
}

function updateMascotImages(isDarkMode) {
    const images = document.querySelectorAll('img[src*="mascote"]'); // Seleciona todas as imagens relacionadas ao mascote
    images.forEach((img) => {
        const newFilter = isDarkMode ? "invert(1)" : "none";
        img.style.filter = newFilter;
    });
}

function updateSanduiche(isDarkMode) {
    const sanduiche = document.getElementById("sanduicheIcon");
    if(sanduiche) {
        if (isDarkMode) {
            sanduiche.style.filter = "none";
        }
        else {
            sanduiche.style.filter = "invert(1)";
        }
    }
}

// Carregar o tema salvo no localStorage ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const darkMode = (localStorage.getItem('dark-mode')) ? true : false;
    if (darkMode) {
        applyDarkTheme();
    }
    else {
        applyLightTheme();
    }
    updateMascotImages(darkMode);
    updateSanduiche(darkMode);
});