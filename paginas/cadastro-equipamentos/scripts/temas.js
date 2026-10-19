const botaoTema =
document.getElementById("btn-troca-tema");

const temaCss =
document.getElementById("tema-css");

const iconeTema =
document.getElementById("icone-tema");

if (botaoTema && temaCss) {

    botaoTema.addEventListener("click", () => {

        const escuro =
        temaCss.getAttribute("href")
        .includes("escuro.css");

        if (escuro) {

            temaCss.setAttribute(
                "href",
                "styles/claro.css"
            );

            iconeTema.textContent = "🌙";

        } else {

            temaCss.setAttribute(
                "href",
                "styles/escuro.css"
            );

            iconeTema.textContent = "☀️";

        }

    });

}

// scripts/temas.js

document.addEventListener("DOMContentLoaded", () => {
    const btnTrocaTema = document.getElementById("btn-troca-tema");
    const linkTemaCss = document.getElementById("tema-css");
    const iconeTema = document.getElementById("icone-tema");

    // Recupera a preferência do usuário ou inicia no tema claro
    const temaSalvo = localStorage.getItem("sigem_tema") || "claro";
    aplicarTema(temaSalvo);

    if (btnTrocaTema) {
        btnTrocaTema.addEventListener("click", () => {
            const novoTema = (linkTemaCss.getAttribute("href").includes("claro.css")) ? "escuro" : "claro";
            aplicarTema(novoTema);
        });
    }

    function aplicarTema(tema) {
        if (tema === "escuro") {
            linkTemaCss.setAttribute("href", "styles/escuro.css");
            if (iconeTema) iconeTema.textContent = "☀️";
            localStorage.setItem("sigem_tema", "escuro");
        } else {
            linkTemaCss.setAttribute("href", "styles/claro.css");
            if (iconeTema) iconeTema.textContent = "🌙";
            localStorage.setItem("sigem_tema", "claro");
        }
    }
});