document.addEventListener("DOMContentLoaded", () => {
    // Referências aos elementos do DOM
    const formCadastro = document.getElementById("cadastroForm");
    const selectRegional = document.getElementById("regional");
    const selectUnidade = document.getElementById("unidade");
    const grupoOutraUnidade = document.getElementById("grupoOutraUnidade");
    const unidadePersonalizada = document.getElementById("unidadePersonalizada");
    const campoDataSolicitacao = document.getElementById("dataSolicitacao");

    // 1. Preenchimento automático da Data da Solicitação com a data atual (YYYY-MM-DD)
    if (campoDataSolicitacao && !campoDataSolicitacao.value) {
        campoDataSolicitacao.value = new Date().toISOString().split("T")[0];
    }

    // 2. Preenchimento do combo de Regionais
    if (selectRegional && typeof regionaisDisponiveis !== "undefined") {
        regionaisDisponiveis.forEach(reg => {
            const option = document.createElement("option");
            option.value = reg.id || reg;          
            option.textContent = reg.nome || reg;  
            selectRegional.appendChild(option);
        });
    }

    // 3. Preenchimento do combo de Unidades agrupadas por categoria
    if (selectUnidade && typeof unidadesGrupoFleury !== "undefined") {
        Object.entries(unidadesGrupoFleury).forEach(([grupo, listaUnidades]) => {
            const optgroup = document.createElement("optgroup");
            optgroup.label = grupo;

            listaUnidades.forEach(unidade => {
                const option = document.createElement("option");
                option.value = unidade.id || unidade;          
                option.textContent = unidade.nome || unidade;  
                optgroup.appendChild(option);
            });

            selectUnidade.appendChild(optgroup);
        });
    }

    // 4. Lógica para o campo condicional "Outra Unidade"
    if (selectUnidade && grupoOutraUnidade && unidadePersonalizada) {
        selectUnidade.addEventListener("change", () => {
            if (selectUnidade.value === "OUTRA") {
                grupoOutraUnidade.style.display = "block";
                unidadePersonalizada.required = true;
                unidadePersonalizada.focus();
            } else {
                grupoOutraUnidade.style.display = "none";
                unidadePersonalizada.required = false;
                unidadePersonalizada.value = "";
            }
        });
    }

    // 5. Captura do Envio do Formulário (Submit)
    if (formCadastro) {
        formCadastro.addEventListener("submit", (e) => {
            e.preventDefault(); // Evita o recarregamento padrão da página

            // Captura os textos selecionados nos selects
            const regionalSelecionada = selectRegional.options[selectRegional.selectedIndex];
            const unidadeSelecionada = selectUnidade.options[selectUnidade.selectedIndex];

            // Resolve o nome da unidade e o ID caso tenha escolhido a opção personalizada
            let unidadeIdFinal = selectUnidade.value;
            let unidadeNomeFinal = unidadeSelecionada.textContent;

            if (unidadeIdFinal === "OUTRA") {
                unidadeIdFinal = "OUTRA";
                unidadeNomeFinal = unidadePersonalizada.value.trim();
            }

            const numeroSerieInput = document.getElementById("numeroSerie").value.trim();

            // Recupera lista existente no localStorage
            let listaEquipamentos = JSON.parse(localStorage.getItem("sigem_equipamentos")) || [];

            // Validação: Evitar número de série duplicado
            const serieExiste = listaEquipamentos.some(
                item => item.numeroSerie.toLowerCase() === numeroSerieInput.toLowerCase()
            );

            if (serieExiste) {
                alert("Atenção: Já existe um equipamento cadastrado com esse número de série!");
                document.getElementById("numeroSerie").focus();
                return;
            }

            // Monta o objeto com os dados completos do equipamento
            const novoEquipamento = {
                id: "EQP-" + Date.now(),
                status: document.getElementById("status").value,
                dataSolicitacao: campoDataSolicitacao.value,
                solicitante: document.getElementById("solicitante").value.trim(),
                regionalId: selectRegional.value,
                regional: regionalSelecionada.textContent,
                unidadeId: unidadeIdFinal,
                unidade: unidadeNomeFinal,
                descricaoAtivo: document.getElementById("descricaoAtivo").value.trim(),
                ativoPai: document.getElementById("ativoPai").value.trim() || "N/A",
                setorInstalacao: document.getElementById("setorInstalacao").value.trim(),
                numeroSerie: numeroSerieInput,
                dataAquisicao: document.getElementById("dataAquisicao").value,
                classificacaoContabil: document.getElementById("classificacaoContabil").value.trim(),
                notaFiscal: document.getElementById("notaFiscal").value.trim(),
                dataRegistro: new Date().toISOString()
            };

            // Adiciona o novo equipamento à lista
            listaEquipamentos.push(novoEquipamento);

            // Salva de volta no localStorage
            localStorage.setItem("sigem_equipamentos", JSON.stringify(listaEquipamentos));

            // Feedback de sucesso ao usuário
            alert("Equipamento cadastrado com sucesso!");

            // Reseta o formulário e oculta o campo condicional de outra unidade
            formCadastro.reset();
            grupoOutraUnidade.style.display = "none";
            
            // Repreenche a data atual após o reset
            campoDataSolicitacao.value = new Date().toISOString().split("T")[0];
        });
    }
});

// Atualiza o contador de caracteres do campo de observações
const textareaObs = document.getElementById("observacoes");
const contadorObs = document.getElementById("contadorObservacoes");

if (textareaObs && contadorObs) {

    // Atualiza ao carregar
    contadorObs.textContent =
    `${textareaObs.value.length} / 500`;

    // Atualiza enquanto digita
    textareaObs.addEventListener("input", () => {
        contadorObs.textContent =
        `${textareaObs.value.length} / 500`;
    });

}

// Mapeamento dos 6 campos do resumo
const inputsResumo = {
    patrimonio: document.getElementById('patrimonio'),
    descricao: document.getElementById('descricaoAtivo'),
    serie: document.getElementById('numeroSerie'),
    regional: document.getElementById('regional'),
    unidade: document.getElementById('unidade'),
    criticidade: document.getElementById('criticidade')
};

function atualizarCardResumo() {
    if (inputsResumo.patrimonio) {
        document.getElementById('resumoPatrimonio').textContent = inputsResumo.patrimonio.value || '--';
    }
    if (inputsResumo.descricao) {
        document.getElementById('resumoEquipamento').textContent = inputsResumo.descricao.value || '--';
    }
    if (inputsResumo.serie) {
        document.getElementById('resumoSerie').textContent = inputsResumo.serie.value || '--';
    }
    if (inputsResumo.regional) {
        const textoRegional = inputsResumo.regional.options[inputsResumo.regional.selectedIndex]?.text;
        document.getElementById('resumoRegional').textContent = inputsResumo.regional.value ? textoRegional : '--';
    }
    if (inputsResumo.unidade) {
        const textoUnidade = inputsResumo.unidade.options[inputsResumo.unidade.selectedIndex]?.text;
        document.getElementById('resumoUnidade').textContent = inputsResumo.unidade.value ? textoUnidade : '--';
    }
    if (inputsResumo.criticidade) {
        const badgeCrit = document.getElementById('resumoCriticidade');
        const valorCrit = inputsResumo.criticidade.value;
        
        if (valorCrit) {
            badgeCrit.textContent = valorCrit;
            // Aplica a classe correspondente ao CSS existente
            const classeMapa = {
                'Alta': 'criticidade-alta',
                'Media': 'criticidade-media',
                'Baixa': 'criticidade-baixa'
            };
            badgeCrit.className = `badge-status ${classeMapa[valorCrit] || 'badge-neutral'}`;
        } else {
            badgeCrit.textContent = 'Não Informado';
            badgeCrit.className = 'badge-status badge-neutral';
        }
    }
}

// Vincula ouvintes em todos os inputs relevantes
Object.values(inputsResumo).forEach(input => {
    if (input) {
        input.addEventListener('input', atualizarCardResumo);
        input.addEventListener('change', atualizarCardResumo);
    }
});