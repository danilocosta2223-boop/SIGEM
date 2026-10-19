document.addEventListener("DOMContentLoaded", () => {
    // Referências globais das instâncias dos gráficos para destruição/re-renderização limpa
    let graficoRegionalInst = null;
    let graficoUnidadeInst = null;
    let graficoFabricanteInst = null;
    let graficoCrescimentoInst = null;

    // Chave padronizada do LocalStorage
    const STORAGE_KEY = "sigem_equipamentos";

    // --- FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO DO DASHBOARD ---
    function atualizarDashboard() {
        // 1. Lê os equipamentos cadastrados no localStorage
        const equipamentos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        // 2. Atualiza os Cards de Métricas e Indicadores
        atualizarCards(equipamentos);

        // 3. Renderiza os Gráficos Estatísticos via Chart.js
        renderizarGraficos(equipamentos);

        // 4. Renderiza a Tabela e Lista de Equipamentos (respeitando eventual busca)
        const inputBusca = document.getElementById("inputBusca");
        const termoBusca = inputBusca ? inputBusca.value : "";
        renderizarTabela(equipamentos, termoBusca);
    }

    // --- 1. ATUALIZAÇÃO DOS CARDS ---
    function atualizarCards(equipamentos) {
        const totalEquipamentos = equipamentos.length;

        // Contagem de elementos únicos
        const regionais = new Set(equipamentos.map(e => e.regional?.trim()).filter(Boolean));
        const unidades = new Set(equipamentos.map(e => e.unidade?.trim()).filter(Boolean));
        const modelos = new Set(equipamentos.map(e => e.modelo?.trim()).filter(Boolean));
        const fabricantes = new Set(equipamentos.map(e => e.fabricante?.trim()).filter(Boolean));

        // Cadastrados Hoje
        const hojeIso = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const cadastrosHoje = equipamentos.filter(e => {
            const dataReg = e.dataRegistro || e.dataAquisicao;
            if (!dataReg) return false;
            return dataReg.startsWith(hojeIso);
        }).length;

        // Atualiza elementos DOM
        setElementText("totalEquipamentos", totalEquipamentos);
        setElementText("totalRegionais", regionais.size);
        setElementText("totalUnidades", unidades.size);
        setElementText("totalModelos", modelos.size);
        setElementText("totalFabricantes", fabricantes.size);
        setElementText("cadastrosHoje", cadastrosHoje);
    }

    // Auxiliary para setar texto com segurança no DOM
    function setElementText(id, valor) {
        const el = document.getElementById(id);
        if (el) el.textContent = valor;
    }

    // --- 2. RENDERIZAÇÃO DOS GRÁFICOS (CHART.JS) ---
    function renderizarGraficos(equipamentos) {
        const regionalCounts = {};
        const unidadeCounts = {};
        const fabricanteCounts = {};
        const crescimentoCounts = {};

        // Processamento dinâmico dos dados do LocalStorage
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
            
            // Agrupamento para Crescimento Mensal (YYYY-MM)
            const dataRaw = e.dataRegistro || e.dataAquisicao;
            if (dataRaw) {
                const mesAno = dataRaw.substring(0, 7); // Ex: "2026-10"
                crescimentoCounts[mesAno] = (crescimentoCounts[mesAno] || 0) + 1;
            }
        });

        // Paleta de cores corporativa Engenharia Clínica
        const cores = ['#005A9C', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6f42c1', '#fd7e14', '#20c997'];

        // A) Gráfico por Regional (Doughnut)
        const canvasRegional = document.getElementById("graficoRegional");
        if (canvasRegional) {
            if (graficoRegionalInst) graficoRegionalInst.destroy();
            graficoRegionalInst = new Chart(canvasRegional.getContext("2d"), {
                type: "doughnut",
                data: {
                    labels: Object.keys(regionalCounts).length ? Object.keys(regionalCounts) : ["Sem dados"],
                    datasets: [{
                        data: Object.values(regionalCounts).length ? Object.values(regionalCounts) : [0],
                        backgroundColor: cores
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "bottom" } }
                }
            });
        }

        // B) Gráfico por Unidade (Barras Horizontais)
        const canvasUnidade = document.getElementById("graficoUnidade");
        if (canvasUnidade) {
            if (graficoUnidadeInst) graficoUnidadeInst.destroy();
            graficoUnidadeInst = new Chart(canvasUnidade.getContext("2d"), {
                type: "bar",
                data: {
                    labels: Object.keys(unidadeCounts).length ? Object.keys(unidadeCounts) : ["Sem dados"],
                    datasets: [{
                        label: "Equipamentos",
                        data: Object.values(unidadeCounts).length ? Object.values(unidadeCounts) : [0],
                        backgroundColor: "#28a745",
                        borderRadius: 4
                    }]
                },
                options: {
                    indexAxis: "y",
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } }
                }
            });
        }

        // C) Gráfico por Fabricante (Barras Verticais)
        const canvasFabricante = document.getElementById("graficoFabricante");
        if (canvasFabricante) {
            if (graficoFabricanteInst) graficoFabricanteInst.destroy();
            graficoFabricanteInst = new Chart(canvasFabricante.getContext("2d"), {
                type: "bar",
                data: {
                    labels: Object.keys(fabricanteCounts).length ? Object.keys(fabricanteCounts) : ["Sem dados"],
                    datasets: [{
                        label: "Equipamentos",
                        data: Object.values(fabricanteCounts).length ? Object.values(fabricanteCounts) : [0],
                        backgroundColor: "#005A9C",
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

        // D) Gráfico de Crescimento Mensal (Linha Suave)
        const mesesOrdenados = Object.keys(crescimentoCounts).sort();
        const canvasCrescimento = document.getElementById("graficoCrescimento");
        if (canvasCrescimento) {
            if (graficoCrescimentoInst) graficoCrescimentoInst.destroy();
            graficoCrescimentoInst = new Chart(canvasCrescimento.getContext("2d"), {
                type: "line",
                data: {
                    labels: mesesOrdenados.length ? mesesOrdenados : ["Sem registros"],
                    datasets: [{
                        label: "Novos Cadastros",
                        data: mesesOrdenados.length ? mesesOrdenados.map(m => crescimentoCounts[m]) : [0],
                        borderColor: "#6f42c1",
                        backgroundColor: "rgba(111, 66, 193, 0.1)",
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

    // --- 3. RENDERIZAÇÃO DA TABELA E CONSULTA RÁPIDA ---
    function renderizarTabela(equipamentos, termoBusca = "") {
        const tabela = document.getElementById("tabelaEquipamentos");
        const tbody = document.getElementById("tabelaEquipamentosBody");
        const emptyState = document.getElementById("emptyState");
        const contadorRegistros = document.getElementById("contadorRegistros");

        // Aplica o filtro de pesquisa em tempo real
        let filtrados = equipamentos;
        if (termoBusca.trim() !== "") {
            const termo = termoBusca.toLowerCase();
            filtrados = equipamentos.filter(e => 
                (e.numeroSerie && e.numeroSerie.toLowerCase().includes(termo)) ||
                (e.descricaoAtivo && e.descricaoAtivo.toLowerCase().includes(termo)) ||
                (e.fabricante && e.fabricante.toLowerCase().includes(termo)) ||
                (e.modelo && e.modelo.toLowerCase().includes(termo)) ||
                (e.regional && e.regional.toLowerCase().includes(termo)) ||
                (e.unidade && e.unidade.toLowerCase().includes(termo)) ||
                (e.setorInstalacao || e.setor ? (e.setorInstalacao || e.setor).toLowerCase().includes(termo) : false)
            );
        }

        // Atualiza o contador visual de registros
        if (contadorRegistros) {
            contadorRegistros.textContent = `${filtrados.length} registro(s) salvo(s)`;
        }

        // Caso o banco do LocalStorage ou a busca estejam vazios
        if (filtrados.length === 0) {
            if (tabela) tabela.style.display = "none";
            if (emptyState) emptyState.style.display = "block";
            if (tbody) tbody.innerHTML = "";
            return;
        }

        // Mostra a tabela e oculta a mensagem de estado vazio
        if (tabela) tabela.style.display = "table";
        if (emptyState) emptyState.style.display = "none";

        // Ordena para mostrar os mais recentes primeiro
        const listaInvertida = [...filtrados].reverse();

        if (tbody) {
            tbody.innerHTML = listaInvertida.map(e => {
                // Formatação legível da Data de Registro
                let dataFormatada = "-";
                const rawData = e.dataRegistro || e.dataAquisicao;
                if (rawData) {
                    try {
                        const d = new Date(rawData);
                        if (!isNaN(d.getTime())) {
                            dataFormatada = d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
                        } else {
                            dataFormatada = rawData;
                        }
                    } catch {
                        dataFormatada = rawData;
                    }
                }

                return `
                    <tr>
                        <td><strong>${e.numeroSerie || '-'}</strong></td>
                        <td>${e.descricaoAtivo || '-'}</td>
                        <td>${e.fabricante || '-'}</td>
                        <td>${e.modelo || '-'}</td>
                        <td>${e.regional || '-'}</td>
                        <td>${e.unidade || '-'}</td>
                        <td>${e.setorInstalacao || e.setor || '-'}</td>
                        <td>${dataFormatada}</td>
                    </tr>
                `;
            }).join("");
        }
    }

    // --- 4. EVENTOS E SINCRONIZAÇÃO EM TEMPO REAL ---

    // A) Escuta a digitação no campo de busca rápida
    const inputBusca = document.getElementById("inputBusca");
    if (inputBusca) {
        inputBusca.addEventListener("input", (e) => {
            const equipamentos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            renderizarTabela(equipamentos, e.target.value);
        });
    }

    // B) Escuta o clique no botão Atualizar Dashboard
    const btnAtualizar = document.getElementById("btnAtualizar");
    if (btnAtualizar) {
        btnAtualizar.addEventListener("click", () => {
            atualizarDashboard();
        });
    }

    // C) Sincronização entre abas/janelas (Storage Event)
    window.addEventListener("storage", (event) => {
        if (event.key === STORAGE_KEY) {
            atualizarDashboard();
        }
    });

    // D) Atualização automática a cada 5 segundos (Tempo Real Reativo)
    setInterval(() => {
        atualizarDashboard();
    }, 5000);

    // E) Execução Inicial ao carregar a página
    atualizarDashboard();
});


// dashboard.js - Configuração de Cores para o Chart.js

function obterCoresTema() {
  const modoEscuro = document.body.classList.contains('dark-mode') || 
                     document.documentElement.getAttribute('data-theme') === 'dark';

  return {
    texto: modoEscuro ? '#f3f4f6' : '#333333',
    grade: modoEscuro ? '#3f444f' : '#e5e7eb'
  };
}

// Exemplo de aplicação ao criar/atualizar um gráfico no SIGEM:
const cores = obterCoresTema();

const meuGrafico = new Chart(ctx, {
  type: 'bar', // ou 'line', 'pie', etc.
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: cores.texto
        }
      }
    },
    scales: {
      x: {
        ticks: { color: cores.texto },
        grid: { color: cores.grade }
      },
      y: {
        ticks: { color: cores.texto },
        grid: { color: cores.grade }
      }
    }
  }
});