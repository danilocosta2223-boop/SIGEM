document.addEventListener("DOMContentLoaded", () => {
    const campoRegional = document.getElementById("regional");
    const campoUnidade = document.getElementById("unidade");
    const listaRegionais = document.getElementById("listaRegionais");
    const listaUnidades = document.getElementById("listaUnidades");
    const formCadastro = document.getElementById("cadastroForm");

    // Chave padronizada com o Dashboard
    const STORAGE_KEY = "sigem_equipamentos";

    // Dicionário de nomes amigáveis para as regionais
    const nomesRegionais = {
        "REG-SP": "São Paulo",
        "REG-RJ": "Rio de Janeiro",
        "REG-MG": "Minas Gerais",
        "REG-BA": "Bahia",
        "REG-PE": "Pernambuco",
        "REG-PR": "Paraná",
        "REG-RS": "Rio Grande do Sul",
        "REG-ES": "Espírito Santo",
        "REG-DF": "Distrito Federal",
        "REG-PA": "Pará",
        "REG-MA": "Maranhão"
    };

    // 1. Preenche o datalist de Regionais usando textContent para máxima compatibilidade
    if (listaRegionais && typeof unidadesPorRegional !== "undefined") {
        Object.keys(unidadesPorRegional).forEach(regional => {
            const option = document.createElement("option");
            option.value = regional;
            option.textContent = nomesRegionais[regional] || regional;
            listaRegionais.appendChild(option);
        });
    }

    // Estado inicial: desativa o campo unidade se nenhuma regional válida estiver selecionada
    if (campoRegional && campoUnidade) {
        if (!campoRegional.value || !unidadesPorRegional[campoRegional.value]) {
            campoUnidade.disabled = true;
        }

        // 2. Ouve alterações na Regional para atualizar o datalist de Unidades em cascata
        campoRegional.addEventListener("input", () => {
            const regionalSelecionada = campoRegional.value.trim();
            
            // Limpa o datalist de unidades e o valor atual do input
            listaUnidades.innerHTML = "";
            campoUnidade.value = "";

            if (!unidadesPorRegional[regionalSelecionada]) {
                campoUnidade.disabled = true;
                return;
            }

            // Habilita e popula as unidades correspondentes à regional escolhida
            campoUnidade.disabled = false;
            unidadesPorRegional[regionalSelecionada].forEach(unidade => {
                const option = document.createElement("option");
                option.value = unidade.nome;
                listaUnidades.appendChild(option);
            });
        });
    }

    // 3. Captura o envio do formulário com validações rigorosas
    if (formCadastro) {
        formCadastro.addEventListener("submit", (e) => {
            e.preventDefault();

            const regionalSelecionada = campoRegional.value.trim();
            const nomeUnidadeSelecionada = campoUnidade.value.trim();
            const numeroSerieInput = document.getElementById("numeroSerie")?.value.trim() || "";

            // Validação de unidade válida para a regional
            const unidadeObj = unidadesPorRegional[regionalSelecionada]?.find(u => u.nome === nomeUnidadeSelecionada);
            if (!unidadeObj) {
                alert("Selecione uma unidade válida para a regional escolhida.");
                campoUnidade.focus();
                return;
            }

            // Carrega os equipamentos atuais para validações
            const equipamentos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

            // Validação anti-duplicidade de Número de Série (caso preenchido)
            if (numeroSerieInput) {
                const existe = equipamentos.some(
                    item => item.numeroSerie && item.numeroSerie.toUpperCase() === numeroSerieInput.toUpperCase()
                );

                if (existe) {
                    alert("Atenção: Já existe um equipamento cadastrado com este Número de Série.");
                    document.getElementById("numeroSerie").focus();
                    return;
                }
            }

            // Monta o objeto completo do ativo
            const dadosAtivo = {
                id: "ATV-" + Date.now(),
                regional: regionalSelecionada,
                regionalNome: nomesRegionais[regionalSelecionada] || regionalSelecionada,
                unidade: nomeUnidadeSelecionada,
                unidadeId: unidadeObj.id,
                numeroSerie: numeroSerieInput,
                descricaoAtivo: document.getElementById("descricaoAtivo")?.value.trim() || "",
                fabricante: document.getElementById("fabricante")?.value.trim() || "",
                modelo: document.getElementById("modelo")?.value.trim() || "",
                setorInstalacao: document.getElementById("setorInstalacao")?.value.trim() || "",
                dataCadastro: new Date().toISOString()
            };

            // Salva no LocalStorage com a chave correta
            try {
                equipamentos.push(dadosAtivo);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(equipamentos));

                alert("Ativo cadastrado com sucesso! 🚀");
                formCadastro.reset();
                campoUnidade.disabled = true;
            } catch (error) {
                console.error("Erro ao salvar no LocalStorage:", error);
                alert("Erro ao salvar o ativo. Verifique o console.");
            }
        });
    }
});