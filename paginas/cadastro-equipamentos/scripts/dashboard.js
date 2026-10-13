document.addEventListener("DOMContentLoaded", () => {
    // Referências globais dos gráficos para poder destruí-los e recriá-los ao atualizar
    let graficoRegionalInstance = null;
    let graficoUnidadeInstance = null;
    let graficoFabricanteInstance = null;
    let graficoCrescimentoInstance = null;

    // Função principal de atualização do Dashboard
    function atualizarDashboard() {
        // 1. Lê os equipamentos do localStorage
        const equipamentos = JSON.parse(localStorage.getItem("sigem_equipamentos")) || [];

        // 2. Atualiza a Data de Última Atualização
        const agora = new Date();
        const dataFormatada = agora.toLocaleDateString("pt-BR") + " " + agora.toLocaleTimeString("pt-BR");
        const elUltimaAtualizacao = document.getElementById("ultimaAtualizacao");
        if (elUltimaAtualizacao) elUltimaAtualizacao.textContent = dataFormatada;

        // 3. Atualiza os Cards de Totais
        const elTotal = document.getElementById("totalEquipamentos");
        if (elTotal) elTotal.textContent = equipamentos.length;

        // Total de Fabricantes únicos
        const fabricantes = new Set(equipamentos.map(e => e.fabricante?.trim()).filter(Boolean));
        const elFab = document.getElementById("totalFabricantes");
        if (elFab) elFab.textContent = fabricantes.size;

        // Total de Modelos únicos
        const modelos = new Set(equipamentos.map(e => e.modelo?.trim()).filter(Boolean));
        const elMod = document.getElementById("totalModelos");
        if (elMod) elMod.textContent = modelos.size;

        // Total de Regionais únicas
        const regionais = new Set(equipamentos.map(e => e.regional?.trim()).filter(Boolean));
        const elReg = document.getElementById("totalRegionais");
        if (elReg) elReg.textContent = regionais.size;

        // Total de Unidades únicas
        const unidades = new Set(equipamentos.map(e => e.unidade?.trim()).filter(Boolean));
        const elUnd = document.getElementById("totalUnidades");
        if (elUnd) elUnd.textContent = unidades.size;

        // Total de Setores únicos (compatível com setorInstalacao)
        const setores = new Set(equipamentos.map(e => (e.setorInstalacao || e.setor)?.trim()).filter(Boolean));
        const elSetor = document.getElementById("totalSetores");
        if (elSetor) elSetor.textContent = setores.size;

        // Cadastros Realizados Hoje
        const hojeStr = agora.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const cadastrosHoje = equipamentos.filter(e => {
            const dataRegRaw = e.dataRegistro || e.dataAquisicao;
            if (!dataRegRaw) return false;
            let dataReg = dataRegRaw;
            if (dataReg.includes('/')) {
                const partes = dataReg.split(' ')[0].split('/');
                dataReg = `${partes[2]}-${partes[1]}-${partes[0]}`;
            }
            return dataReg.startsWith(hojeStr);
        });
        const elHoje = document.getElementById("cadastrosHoje");
        if (elHoje) elHoje.textContent = cadastrosHoje.length;

        // Último Equipamento Registrado (usando descricaoAtivo e numeroSerie)
        const elUltimo = document.getElementById("ultimoEquipamento");
        if (elUltimo) {
            if (equipamentos.length > 0) {
                const ultimo = equipamentos[equipamentos.length - 1];
                elUltimo.textContent = ultimo.descricaoAtivo || ultimo.numeroSerie || "Registrado";
            } else {
                elUltimo.textContent = "--";
            }
        }

        // 4. Renderiza a Tabela e Contagem
        renderizarTabela(equipamentos);

        // 5. Atualiza os Gráficos
        atualizarGraficos(equipamentos);
    }

    // Função para renderizar a tabela com base nos equipamentos (e suporte ao filtro de busca)
    function renderizarTabela(equipamentos, termoBusca = "") {
        const tbodyUltimos = document.getElementById("ultimosCadastros");
        const spanTotalTabela = document.getElementById("totalTabela");
        const divVazio = document.getElementById("dashboardVazio");
        const tabelaEl = document.querySelector(".dashboard-tabela table");

        // Filtra por termo de busca se houver (usando numeroSerie e descricaoAtivo)
        let listaFiltrada = equipamentos;
        if (termoBusca.trim() !== "") {
            const termo = termoBusca.toLowerCase();
            listaFiltrada = equipamentos.filter(e => 
                (e.numeroSerie && e.numeroSerie.toLowerCase().includes(termo)) ||
                (e.descricaoAtivo && e.descricaoAtivo.toLowerCase().includes(termo)) ||
                (e.fabricante && e.fabricante.toLowerCase().includes(termo)) ||
                (e.modelo && e.modelo.toLowerCase().includes(termo)) ||
                (e.regional && e.regional.toLowerCase().includes(termo)) ||
                (e.unidade && e.unidade.toLowerCase().includes(termo))
            );
        }

        if (spanTotalTabela) spanTotalTabela.textContent = `(${listaFiltrada.length})`;

        if (equipamentos.length === 0) {
            if (tabelaEl) tabelaEl.style.display = "none";
            if (divVazio) {
                divVazio.style.display = "block";
                divVazio.textContent = "Nenhum equipamento cadastrado.";
            }
            if (tbodyUltimos) tbodyUltimos.innerHTML = "";
            return;
        }

        if (listaFiltrada.length === 0) {
            if (tabelaEl) tabelaEl.style.display = "none";
            if (divVazio) {
                divVazio.style.display = "block";
                divVazio.textContent = "Nenhum equipamento encontrado com esse termo de busca.";
            }
            if (tbodyUltimos) tbodyUltimos.innerHTML = "";
            return;
        }

        if (tabelaEl) tabelaEl.style.display = "table";
        if (divVazio) divVazio.style.display = "none";

        // Pega os últimos cadastrados (inverte para mostrar os mais recentes primeiro) e limita a 10 linhas
        const ultimos = [...listaFiltrada].reverse().slice(0, 10);
        if (tbodyUltimos) {
            tbodyUltimos.innerHTML = ultimos.map(e => `
                <tr>
                    <td>${e.numeroSerie || '-'}</td>
                    <td>${e.descricaoAtivo || '-'}</td>
                    <td>${e.fabricante || '-'}</td>
                    <td>${e.modelo || '-'}</td>
                    <td>${e.regional || '-'}</td>
                    <td>${e.unidade || '-'}</td>
                </tr>
            `).join('');
        }
    }

    // Função para atualizar os gráficos do Chart.js dinamicamente
    function atualizarGraficos(equipamentos) {
        const regionalCounts = {};
        const unidadeCounts = {};
        const fabricanteCounts = {};
        const crescimentoCounts = {};

        equipamentos.forEach(e => {
            if (e.regional) {
                const reg = e.regional.trim();
                regionalCounts[reg] = (regionalCounts[reg] || 0) + 1;
            }
            if (e.unidade) {
                const und = e.unidade.trim();
                unidadeCounts[und] = (unidadeCounts[und] || 0) + 1;
            }
            if (e.fabricante) {
                const fab = e.fabricante.trim();
                fabricanteCounts[fab] = (fabricanteCounts[fab] || 0) + 1;
            }
            const dataReg = e.dataRegistro || e.dataAquisicao;
            if (dataReg) {
                let mesAno = dataReg.substring(0, 7); // ex: "2026-10"
                crescimentoCounts[mesAno] = (crescimentoCounts[mesAno] || 0) + 1;
            }
        });

        const coresPadrao = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c'];

        // 1. Gráfico Regional (Pizza / Doughnut)
        const ctxRegional = document.getElementById('graficoRegional');
        if (ctxRegional) {
            if (graficoRegionalInstance) graficoRegionalInstance.destroy();
            graficoRegionalInstance = new Chart(ctxRegional.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: Object.keys(regionalCounts),
                    datasets: [{
                        data: Object.values(regionalCounts),
                        backgroundColor: coresPadrao
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }

        // 2. Gráfico Unidade (Barras)
        const ctxUnidade = document.getElementById('graficoUnidade');
        if (ctxUnidade) {
            if (graficoUnidadeInstance) graficoUnidadeInstance.destroy();
            graficoUnidadeInstance = new Chart(ctxUnidade.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: Object.keys(unidadeCounts),
                    datasets: [{
                        label: 'Qtd. Equipamentos',
                        data: Object.values(unidadeCounts),
                        backgroundColor: '#28a745',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                }
            });
        }

        // 3. Gráfico Fabricante (Barras)
        const ctxFabricante = document.getElementById('graficoFabricante');
        if (ctxFabricante) {
            if (graficoFabricanteInstance) graficoFabricanteInstance.destroy();
            graficoFabricanteInstance = new Chart(ctxFabricante.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: Object.keys(fabricanteCounts),
                    datasets: [{
                        label: 'Qtd. Equipamentos',
                        data: Object.values(fabricanteCounts),
                        backgroundColor: '#007bff',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                }
            });
        }

        // 4. Crescimento Mensal (Linha)
        const mesesOrdenados = Object.keys(crescimentoCounts).sort();
        const ctxCrescimento = document.getElementById('graficoCrescimento');
        if (ctxCrescimento) {
            if (graficoCrescimentoInstance) graficoCrescimentoInstance.destroy();
            graficoCrescimentoInstance = new Chart(ctxCrescimento.getContext('2d'), {
                type: 'line',
                data: {
                    labels: mesesOrdenados.length > 0 ? mesesOrdenados : ['Nenhum registro'],
                    datasets: [{
                        label: 'Cadastros no Período',
                        data: mesesOrdenados.length > 0 ? mesesOrdenados.map(m => crescimentoCounts[m]) : [0],
                        borderColor: '#6f42c1',
                        backgroundColor: 'rgba(111, 66, 193, 0.1)',
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                }
            });
        }
    }

    // Busca Rápida
    const inputBusca = document.getElementById("buscaEquipamento");
    if (inputBusca) {
        inputBusca.addEventListener("input", (e) => {
            const equipamentos = JSON.parse(localStorage.getItem("sigem_equipamentos")) || [];
            renderizarTabela(equipamentos, e.target.value);
        });
    }

    // Botão de Atualização Manual
    const btnAtualizar = document.getElementById("btnAtualizar");
    if (btnAtualizar) {
        btnAtualizar.addEventListener("click", () => {
            atualizarDashboard();
        });
    }

    // Carga inicial
    atualizarDashboard();

    // Sincronização entre abas (Storage Event)
    window.addEventListener("storage", (event) => {
        if (event.key === "sigem_equipamentos") {
            atualizarDashboard();
        }
    });

    // Atualização leve a cada 5 segundos (ótima performance e excelente tempo real)
    setInterval(() => {
        atualizarDashboard();
    }, 5000);
});