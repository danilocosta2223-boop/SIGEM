document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. SELETORES E ELEMENTOS DO DOM (Atualizados)
    // ==========================================
    const DOM = {
        form: document.getElementById("cadastroForm"),
        regional: document.getElementById("regional"),
        unidade: document.getElementById("unidade"),
        grupoOutraUnidade: document.getElementById("grupoOutraUnidade"),
        unidadePersonalizada: document.getElementById("unidadePersonalizada"),
        dataSolicitacao: document.getElementById("dataSolicitacao"),
        observacoes: document.getElementById("observacoes"),
        contadorObservacoes: document.getElementById("contadorObservacoes"),
        numeroSerie: document.getElementById("numeroSerie"),
        solicitante: document.getElementById("solicitante"),
        descricaoAtivo: document.getElementById("descricaoAtivo"),
        setorInstalacao: document.getElementById("setorInstalacao"),
        dataAquisicao: document.getElementById("dataAquisicao"),
        notaFiscal: document.getElementById("notaFiscal"),
        fabricante: document.getElementById("fabricante"),
        modelo: document.getElementById("modelo"),
        // Card de Resumo (Com Fabricante e Modelo)
        resumoEquipamento: document.getElementById("resumoEquipamento"),
        resumoFabricante: document.getElementById("resumoFabricante"),
        resumoModelo: document.getElementById("resumoModelo"),
        resumoSerie: document.getElementById("resumoSerie"),
        resumoRegional: document.getElementById("resumoRegional"),
        resumoUnidade: document.getElementById("resumoUnidade")
    };

    // ==========================================
    // 2. FUNÇÕES AUXILIARES E DE NEGÓCIO
    // ==========================================

    // Inicializa campos padrão (Data da Solicitação)
    function inicializarCamposPadrao() {
        if (DOM.dataSolicitacao && !DOM.dataSolicitacao.value) {
            DOM.dataSolicitacao.value = new Date().toISOString().split("T")[0];
        }
        if (DOM.unidade) {
            DOM.unidade.disabled = true;
        }
    }

    // Carrega as regionais no select principal
    function carregarRegionais() {
        if (DOM.regional && typeof regionaisDisponiveis !== "undefined") {
            DOM.regional.innerHTML = '<option value="" data-i18n="selecioneRegional">Selecione a Regional...</option>';
            regionaisDisponiveis.forEach(reg => {
                const option = document.createElement("option");
                option.value = reg.id;
                option.textContent = reg.nome;
                DOM.regional.appendChild(option);
            });
        }
    }

    // Atualiza o card de resumo em tempo real
    function atualizarCardResumo() {
        if (DOM.resumoEquipamento) {
            DOM.resumoEquipamento.textContent = DOM.descricaoAtivo?.value || '--';
        }
        if (DOM.resumoFabricante) {
            DOM.resumoFabricante.textContent = DOM.fabricante?.value || '--';
        }
        if (DOM.resumoModelo) {
            DOM.resumoModelo.textContent = DOM.modelo?.value || '--';
        }
        if (DOM.resumoSerie) {
            DOM.resumoSerie.textContent = DOM.numeroSerie?.value || '--';
        }
        if (DOM.resumoRegional && DOM.regional) {
            const textoRegional = DOM.regional.options[DOM.regional.selectedIndex]?.text;
            DOM.resumoRegional.textContent = DOM.regional.value ? textoRegional : '--';
        }
        if (DOM.resumoUnidade && DOM.unidade) {
            const textoUnidade = DOM.unidadePersonalizada && DOM.unidadePersonalizada.value && DOM.unidade.value === "OUTRA" 
                ? DOM.unidadePersonalizada.value 
                : DOM.unidade.options[DOM.unidade.selectedIndex]?.text;
            DOM.resumoUnidade.textContent = DOM.unidade.value ? textoUnidade : '--';
        }
    }

    // Reseta o formulário para o estado inicial (com escopo local seguro)
    const ToResetForm = () => {
        if (DOM.form) DOM.form.reset();
        if (DOM.grupoOutraUnidade) DOM.grupoOutraUnidade.style.display = "none";
        if (DOM.unidade) {
            DOM.unidade.disabled = true;
            DOM.unidade.innerHTML = '<option value="">Primeiro selecione uma regional...</option>';
        }
        inicializarCamposPadrao();
        atualizarCardResumo();
    };

    // ==========================================
    // 3. CONFIGURAÇÃO DE EVENTOS (LISTENERS)
    // ==========================================

    // Mudança de Regional -> Atualiza unidades dependentes
    if (DOM.regional && DOM.unidade) {
        DOM.regional.addEventListener("change", (e) => {
            const regionalId = e.target.value;
            DOM.unidade.innerHTML = '<option value="" data-i18n="selecioneUnidade">Selecione a Unidade...</option>';
            
            if (DOM.grupoOutraUnidade) DOM.grupoOutraUnidade.style.display = "none";
            if (DOM.unidadePersonalizada) {
                DOM.unidadePersonalizada.required = false;
                DOM.unidadePersonalizada.value = "";
            }

            if (regionalId && typeof unidadesPorRegional !== "undefined" && unidadesPorRegional[regionalId]) {
                DOM.unidade.disabled = false;
                unidadesPorRegional[regionalId].forEach(unidade => {
                    const option = document.createElement("option");
                    option.value = unidade.id;
                    option.textContent = unidade.nome;
                    DOM.unidade.appendChild(option);
                });

                const optOutra = document.createElement("option");
                optOutra.value = "OUTRA";
                optOutra.textContent = "Outra Unidade (Digitar manualmente)";
                DOM.unidade.appendChild(optOutra);
            } else {
                DOM.unidade.disabled = true;
                DOM.unidade.innerHTML = '<option value="" data-i18n="selecioneRegionalPrimeiro">Primeiro selecione uma regional...</option>';
            }
            atualizarCardResumo();
        });

        // Mudança de Unidade -> Controla campo "Outra Unidade"
        DOM.unidade.addEventListener("change", (e) => {
            if (e.target.value === "OUTRA" && DOM.grupoOutraUnidade && DOM.unidadePersonalizada) {
                DOM.grupoOutraUnidade.style.display = "block";
                DOM.unidadePersonalizada.required = true;
                DOM.unidadePersonalizada.focus();
            } else if (DOM.grupoOutraUnidade && DOM.unidadePersonalizada) {
                DOM.grupoOutraUnidade.style.display = "none";
                DOM.unidadePersonalizada.required = false;
                DOM.unidadePersonalizada.value = "";
            }
            atualizarCardResumo();
        });
    }

    // Contador de Caracteres (Observações)
    if (DOM.observacoes && DOM.contadorObservacoes) {
        DOM.contadorObservacoes.textContent = `${DOM.observacoes.value.length} / 500`;
        DOM.observacoes.addEventListener("input", () => {
            DOM.contadorObservacoes.textContent = `${DOM.observacoes.value.length} / 500`;
        });
    }

    // Ouve alterações nos inputs para atualizar o resumo em tempo real
    const inputsParaResumo = [
        DOM.descricaoAtivo,
        DOM.numeroSerie,
        DOM.fabricante,
        DOM.modelo,
        DOM.regional,
        DOM.unidade,
        DOM.unidadePersonalizada
    ];
    
    inputsParaResumo.forEach(input => {
        if (input) {
            input.addEventListener('input', atualizarCardResumo);
            input.addEventListener('change', atualizarCardResumo);
        }
    });

    // ==========================================
    // 4. ENVIO DO FORMULÁRIO (SUBMIT)
    // ==========================================
    if (DOM.form) {
        DOM.form.addEventListener("submit", (e) => {
            e.preventDefault();

            const regionalSelecionada = DOM.regional.options[DOM.regional.selectedIndex];
            const unidadeSelecionada = DOM.unidade.options[DOM.unidade.selectedIndex];

            let unidadeIdFinal = DOM.unidade.value;
            let unidadeNomeFinal = unidadeSelecionada.textContent;
            if (unidadeIdFinal === "OUTRA") {
                unidadeIdFinal = "OUTRA";
                unidadeNomeFinal = DOM.unidadePersonalizada.value.trim();
            }

            const numeroSerieInput = DOM.numeroSerie.value.trim();
            let listaEquipamentos = JSON.parse(localStorage.getItem("sigem_equipamentos")) || [];

            const serieExiste = listaEquipamentos.some(
                item => item.numeroSerie.toLowerCase() === numeroSerieInput.toLowerCase()
            );

            if (serieExiste) {
                alert("Atenção: Já existe um equipamento cadastrado com esse número de série!");
                DOM.numeroSerie.focus();
                return;
            }

            // Montagem do objeto unificado e totalmente integrado ao Dashboard
            const novoEquipamento = {
                id: "EQP-" + new Date().getFullYear() + "-" + (Date.now() % 100000),
                numeroSerie: numeroSerieInput,
                descricaoAtivo: DOM.descricaoAtivo.value.trim(),
                fabricante: DOM.fabricante.value.trim(),
                modelo: DOM.modelo.value.trim(),
                regional: regionalSelecionada?.textContent || "",
                regionalId: DOM.regional.value,
                unidade: unidadeNomeFinal,
                unidadeId: unidadeIdFinal,
                setorInstalacao: DOM.setorInstalacao.value.trim(),
                solicitante: DOM.solicitante.value.trim(),
                dataSolicitacao: DOM.dataSolicitacao.value,
                dataAquisicao: DOM.dataAquisicao.value,
                notaFiscal: DOM.notaFiscal.value.trim(),
                dataRegistro: new Date().toISOString(),
                dataRegistroFormatada: new Date().toLocaleDateString("pt-BR")
            };

            listaEquipamentos.push(novoEquipamento);

            try {
                localStorage.setItem("sigem_equipamentos", JSON.stringify(listaEquipamentos));
                alert("Equipamento cadastrado com sucesso!"); 
                ToResetForm();
            } catch (error) {
                alert("Erro ao salvar equipamento. Verifique o espaço de armazenamento do navegador.");
            }
        });
    }

    // ==========================================
    // 5. INICIALIZAÇÃO INICIAL
    // ==========================================
    inicializarCamposPadrao();
    carregarRegionais();
    atualizarCardResumo();
});