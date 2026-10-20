document.getElementById("formConfiguracoes").addEventListener("submit", function (e) {
    e.preventDefault();

    // 1. Captura com segurança os campos de seleção e rádio
    const idioma = document.getElementById("idioma").value;
    const paginaInicial = document.getElementById("paginaInicial").value;
    const imagemSistema = document.getElementById("imagemSistema").value;
    
    const temaEl = document.querySelector('input[name="tema"]:checked');
    const tema = temaEl ? temaEl.value : "claro";

    const corSistemaEl = document.querySelector('input[name="corSistema"]:checked');
    const corSistema = corSistemaEl ? corSistemaEl.value : "azul";

    // 2. Captura o estado dos checkboxes existentes no HTML
    const validarSerie = document.getElementById("validarSerie") ? document.getElementById("validarSerie").checked : true;
    const obrigarFoto = document.getElementById("obrigarFoto") ? document.getElementById("obrigarFoto").checked : false;
    const mostrarFabricantes = document.getElementById("mostrarFabricantes") ? document.getElementById("mostrarFabricantes").checked : true;
    const mostrarRegionais = document.getElementById("mostrarRegionais") ? document.getElementById("mostrarRegionais").checked : true;
    const mostrarUnidades = document.getElementById("mostrarUnidades") ? document.getElementById("mostrarUnidades").checked : true;
    const animacoes = document.getElementById("animacoes") ? document.getElementById("animacoes").checked : false;
    const tempoReal = document.getElementById("tempoReal") ? document.getElementById("tempoReal").checked : false;

    // 3. Agrupa todas as configurações em um único objeto
    const configuracoes = {
        idioma,
        paginaInicial,
        imagemSistema,
        tema,
        corSistema,
        validarSerie,
        obrigarFoto,
        mostrarFabricantes,
        mostrarRegionais,
        mostrarUnidades,
        animacoes,
        tempoReal
    };

    // 4. Salva o objeto unificado no localStorage
    localStorage.setItem("sigem_configuracoes", JSON.stringify(configuracoes));

    // 5. Exibe a mensagem de sucesso visual na tela
    const msg = document.getElementById("msgSucesso");
    if (msg) {
        msg.style.display = "block";
        setTimeout(() => {
            msg.style.display = "none";
        }, 3000);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Lê o objeto unificado do localStorage (com valores padrão caso ainda não tenha salvo)
    const config = JSON.parse(localStorage.getItem("sigem_configuracoes")) || {
        tema: "claro",
        corSistema: "azul",
        idioma: "pt-BR"
    };

    // Aplica o Tema (Claro / Escuro)
    document.body.classList.remove("theme-claro", "theme-escuro", "dark-mode");
    if (config.tema === "escuro") {
        document.body.classList.add("dark-mode", "theme-escuro");
    } else {
        document.body.classList.add("theme-claro");
    }

    // Aplica a Cor do Sistema
    document.body.classList.remove("color-azul", "color-verde", "color-cinza");
    document.body.classList.add(`color-${config.corSistema}`);

    // Aplica o Idioma
    document.documentElement.setAttribute("lang", config.idioma);
});

