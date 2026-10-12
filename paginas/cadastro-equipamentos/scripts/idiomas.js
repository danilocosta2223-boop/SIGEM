async function carregarIdioma(idioma) {
    try {
        // Busca o arquivo JSON correspondente na pasta idiomas/ local
        const resposta = await fetch(`idiomas/${idioma}.json`);
        if (!resposta.ok) throw new Error("Erro ao carregar o arquivo de idioma.");
        
        const textos = await resposta.json();
        
        // 1. Atualiza o texto de todos os elementos marcados com data-i18n
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const chave = el.getAttribute("data-i18n");
            if (textos[chave]) {
                // Se o elemento for um input com placeholder traduzível (opcional)
                if (el.tagName === "INPUT" && el.hasAttribute("data-i18n-placeholder")) {
                    el.placeholder = textos[chave];
                } else {
                    el.textContent = textos[chave];
                }
            }
        });

        // Salva a preferência do usuário no localStorage
        localStorage.setItem("sigem_idioma", idioma);
    } catch (erro) {
        console.error("Falha ao aplicar o idioma:", erro);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const selectorIdioma = document.getElementById("idioma");
    
    // Recupera o idioma salvo ou define o padrão pt-BR
    const idiomaSalvo = localStorage.getItem("sigem_idioma") || "pt-BR";
    
    if (selectorIdioma) {
        selectorIdioma.value = idiomaSalvo;
        selectorIdioma.addEventListener("change", (e) => {
            carregarIdioma(e.target.value);
        });
    }

    // Carrega o idioma ao iniciar a página
    carregarIdioma(idiomaSalvo);
});