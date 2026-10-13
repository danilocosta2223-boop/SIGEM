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