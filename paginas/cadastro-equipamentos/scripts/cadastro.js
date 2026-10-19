// scripts/cadastro.js

// Chave padronizada para persistência no LocalStorage
const STORAGE_KEY = "sigem_equipamentos";

document.addEventListener("DOMContentLoaded", () => {
    // Preenche automaticamente a data da solicitação com a data atual (YYYY-MM-DD)
    const inputDataSolicitacao = document.getElementById("dataSolicitacao");
    if (inputDataSolicitacao && !inputDataSolicitacao.value) {
        const hoje = new Date().toISOString().split("T")[0];
        inputDataSolicitacao.value = hoje;
    }

    // Configuração do formulário de cadastro
    const formulario = document.getElementById("cadastroForm");
    if (formulario) {
        formulario.addEventListener("submit", function(e) {
            e.preventDefault();

            // Captura dos valores do formulário
            const numeroSerieInput = document.getElementById("numeroSerie").value.trim();
            const descricaoAtivoInput = document.getElementById("descricaoAtivo").value.trim();
            const regionalInput = document.getElementById("regional").value.trim();
            
            // Tratamento para unidade personalizada (caso selecione "Outra")
            const selectUnidadeVal = document.getElementById("unidade").value.trim();
            const unidadePersonalizadaVal = document.getElementById("unidadePersonalizada") 
                ? document.getElementById("unidadePersonalizada").value.trim() 
                : "";
            const unidadeInput = (selectUnidadeVal === "Outra" && unidadePersonalizadaVal) 
                ? unidadePersonalizadaVal 
                : selectUnidadeVal;

            // Validação básica de campos obrigatórios
            if (!numeroSerieInput || !descricaoAtivoInput || !regionalInput || !unidadeInput) {
                alert("Por favor, preencha todos os campos obrigatórios (*).");
                return;
            }

            // Recupera os registros existentes no LocalStorage usando a chave padronizada
            const equipamentosExistentes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

            // 2. Validação de Número de Série único (evita equipamentos duplicados)
            const existeSerie = equipamentosExistentes.some(
                e => e.numeroSerie.toLowerCase() === numeroSerieInput.toLowerCase()
            );

            if (existeSerie) {
                alert("Atenção: Já existe um equipamento cadastrado com este Número de Série.");
                document.getElementById("numeroSerie").focus();
                return;
            }

            // Montagem do objeto do novo equipamento
            const novoEquipamento = {
                id: Date.now(), // 3. ID único do equipamento baseado em timestamp
                dataSolicitacao: inputDataSolicitacao ? inputDataSolicitacao.value : "",
                solicitante: document.getElementById("solicitante").value.trim(),
                regional: regionalInput,
                unidade: unidadeInput,
                setorInstalacao: document.getElementById("setorInstalacao").value.trim(),
                numeroSerie: numeroSerieInput,
                descricaoAtivo: descricaoAtivoInput,
                fabricante: document.getElementById("fabricante").value.trim(),
                modelo: document.getElementById("modelo").value.trim(),
                dataAquisicao: document.getElementById("dataAquisicao").value,
                notaFiscal: document.getElementById("notaFiscal").value.trim(),
                observacoes: document.getElementById("observacoes").value.trim(),
                dataCadastro: new Date().toISOString() // 1. Data completa com hora para exibição no Dashboard
            };

            // Adiciona o novo item à lista e salva no LocalStorage
            equipamentosExistentes.push(novoEquipamento);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(equipamentosExistentes));

            alert("Equipamento cadastrado com sucesso!");
            
            // Redireciona de volta para o Dashboard / Início
            window.location.href = "dashboard.html";
        });
    }

    // Contador de caracteres para o campo de observações (máximo 500 caracteres)
    const textareaObservacoes = document.getElementById("observacoes");
    const contadorObservacoes = document.getElementById("contadorObservacoes");

    if (textareaObservacoes && contadorObservacoes) {
        textareaObservacoes.addEventListener("input", () => {
            const digitados = textareaObservacoes.value.length;
            contadorObservacoes.textContent = `${digitados} / 500`;
        });
    }
});