document.addEventListener("DOMContentLoaded", () => {
    // Elementos da DOM
    const filtroGeral = document.getElementById("filtroGeral");
    const filtroRegional = document.getElementById("filtroRegional");
    const filtroFabricante = document.getElementById("filtroFabricante");
    const btnAtualizar = document.getElementById("btnAtualizar");
    const btnExcel = document.getElementById("btnExcel");
    const btnImprimir = document.getElementById("btnImprimir");
    
    const totalEquipamentosEl = document.getElementById("totalEquipamentos");
    const totalFabricantesEl = document.getElementById("totalFabricantes");
    const totalRegionaisEl = document.getElementById("totalRegionais");
    const totalTabelaEl = document.getElementById("totalTabela");
    const ultimaAtualizacaoEl = document.getElementById("ultimaAtualizacao");
    
    const listaEquipamentos = document.getElementById("listaEquipamentos");
    const semEquipamentos = document.getElementById("semEquipamentos");

    // Função para carregar os dados do localStorage
    function obterEquipamentos() {
        const dados = localStorage.getItem("sigem_equipamentos");
        return dados ? JSON.parse(dados) : [];
    }

    // Atualiza o carimbo de data e hora da última atualização na tela
    function atualizarDataRelatorio() {
        if (ultimaAtualizacaoEl) {
            const agora = new Date();
            ultimaAtualizacaoEl.textContent = 
                agora.toLocaleDateString("pt-BR") + " " + agora.toLocaleTimeString("pt-BR");
        }
    }

    // Popular os elementos <select> de Filtro (Regional e Fabricante)
    function popularFiltros(equipamentos) {
        const regionais = [...new Set(equipamentos.map(e => e.regional).filter(Boolean))].sort();
        const fabricantes = [...new Set(equipamentos.map(e => e.fabricante).filter(Boolean))].sort();

        if (filtroRegional) {
            filtroRegional.innerHTML = '<option value="">Todas as Regionais</option>';
            regionais.forEach(reg => {
                filtroRegional.innerHTML += `<option value="${reg}">${reg}</option>`;
            });
        }

        if (filtroFabricante) {
            filtroFabricante.innerHTML = '<option value="">Todos os Fabricantes</option>';
            fabricantes.forEach(fab => {
                filtroFabricante.innerHTML += `<option value="${fab}">${fab}</option>`;
            });
        }
    }

    // Renderizar a tabela e atualizar os cards de resumo
    function renderizarRelatorio() {
        const equipamentos = obterEquipamentos();
        
        // Aplica os filtros atuais com segurança caso os inputs não existam
        const termoBusca = filtroGeral ? filtroGeral.value.toLowerCase().trim() : "";
        const regionalSelecionada = filtroRegional ? filtroRegional.value : "";
        const fabricanteSelecionado = filtroFabricante ? filtroFabricante.value : "";

        const equipamentosFiltrados = equipamentos.filter(eq => {
            const matchGeral = 
                (eq.numeroSerie || "").toLowerCase().includes(termoBusca) ||
                (eq.descricaoAtivo || "").toLowerCase().includes(termoBusca) ||
                (eq.fabricante || "").toLowerCase().includes(termoBusca) ||
                (eq.modelo || "").toLowerCase().includes(termoBusca) ||
                (eq.regional || "").toLowerCase().includes(termoBusca) ||
                (eq.unidade || "").toLowerCase().includes(termoBusca) ||
                (eq.setorInstalacao || "").toLowerCase().includes(termoBusca);
            
            const matchRegional = !regionalSelecionada || eq.regional === regionalSelecionada;
            const matchFabricante = !fabricanteSelecionado || eq.fabricante === fabricanteSelecionado;

            return matchGeral && matchRegional && matchFabricante;
        });

        // Atualiza os cards de resumo gerais com segurança
        if (totalEquipamentosEl) totalEquipamentosEl.textContent = equipamentos.length;
        if (totalFabricantesEl) totalFabricantesEl.textContent = new Set(equipamentos.map(e => e.fabricante).filter(Boolean)).size;
        if (totalRegionaisEl) totalRegionaisEl.textContent = new Set(equipamentos.map(e => e.regional).filter(Boolean)).size;
        if (totalTabelaEl) totalTabelaEl.textContent = `(${equipamentosFiltrados.length})`;

        // Atualiza a hora da última atualização visualizada
        atualizarDataRelatorio();

        // Exibe ou oculta o aviso caso não haja registros
        if (semEquipamentos) {
            if (equipamentosFiltrados.length === 0) {
                if (listaEquipamentos) listaEquipamentos.innerHTML = "";
                semEquipamentos.style.display = "block";
                return;
            }
            semEquipamentos.style.display = "none";
        }

        // Preenche as linhas da tabela (incluindo Data de Cadastro)
        if (listaEquipamentos) {
            listaEquipamentos.innerHTML = equipamentosFiltrados.map(eq => `
                <tr>
                    <td>${eq.numeroSerie || "-"}</td>
                    <td>${eq.descricaoAtivo || "-"}</td>
                    <td>${eq.fabricante || "-"}</td>
                    <td>${eq.modelo || "-"}</td>
                    <td>${eq.regional || "-"}</td>
                    <td>${eq.unidade || "-"}</td>
                    <td>${eq.setorInstalacao || "-"}</td>
                    <td>${eq.dataAquisicao || "-"}</td>
                    <td>${eq.dataRegistroFormatada || eq.dataRegistro || "-"}</td>
                </tr>
            `).join("");
        }
    }

    // Eventos de Ação e Filtro seguros
    if (filtroGeral) filtroGeral.addEventListener("input", renderizarRelatorio);
    if (filtroRegional) filtroRegional.addEventListener("change", renderizarRelatorio);
    if (filtroFabricante) filtroFabricante.addEventListener("change", renderizarRelatorio);
    
    if (btnAtualizar) {
        btnAtualizar.addEventListener("click", () => {
            const dadosAtuais = obterEquipamentos();
            popularFiltros(dadosAtuais);
            renderizarRelatorio();
        });
    }

    if (btnImprimir) {
        btnImprimir.addEventListener("click", () => {
            window.print();
        });
    }

    if (btnExcel) {
        btnExcel.addEventListener("click", () => {
            const equipamentos = obterEquipamentos();
            if (equipamentos.length === 0) {
                alert("Não há dados cadastrados para exportar.");
                return;
            }

            let csv = "Nº Série;Equipamento;Fabricante;Modelo;Regional;Unidade;Setor;Data Aquisição;Data Cadastro\n";
            
            equipamentos.forEach(eq => {
                const dataCad = eq.dataRegistroFormatada || eq.dataRegistro || "";
                csv += `"${eq.numeroSerie || ""}","${eq.descricaoAtivo || ""}","${eq.fabricante || ""}","${eq.modelo || ""}","${eq.regional || ""}","${eq.unidade || ""}","${eq.setorInstalacao || ""}","${eq.dataAquisicao || ""}","${dataCad}"\n`;
            });

            // BOM (\uFEFF) para forçar o Excel a reconhecer caracteres acentuados em UTF-8
            const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const linkDownload = document.createElement("a");
            
            linkDownload.href = url;
            linkDownload.download = "relatorio_equipamentos_sigem.csv";
            document.body.appendChild(linkDownload);
            linkDownload.click();
            document.body.removeChild(linkDownload);
        });
    }

    // Atualização automática e em tempo real
    window.addEventListener("storage", () => {
        renderizarRelatorio();
    });

    setInterval(() => {
        renderizarRelatorio();
    }, 3000);

    // Inicialização ao carregar a página
    const dadosIniciais = obterEquipamentos();
    popularFiltros(dadosIniciais);
    renderizarRelatorio();
});