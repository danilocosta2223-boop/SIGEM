/**
 * Mapeamento de Unidades do Grupo Fleury por Regional
 * Utilizado para o preenchimento dinâmico do select de unidades no cadastro de ativos.
 */
const unidadesPorRegional = {
    "REG-SP": [
        { id: "FLY-IBI", nome: "Fleury — Unidade Ibirapuera" },
        { id: "FLY-AFR", nome: "Fleury — Unidade Alphaville" },
        { id: "FLY-PAS", nome: "Fleury — Unidade Paraíso" },
        { id: "HCO-SPO", nome: "Hospital Hcor" },
        { id: "SAM-SPO", nome: "Hospital Samaritano Higienópolis" },
        { id: "AMAIS-SP", nome: "a+ Medicina Diagnóstica — São Paulo" }
    ],
    "REG-RJ": [
        { id: "LABS-RJA", nome: "Labs a+ — Rio de Janeiro" },
        { id: "FMT-RJA", nome: "Felippe Mattoso — Botafogo" },
        { id: "SAM-RJA", nome: "Hospital Samaritano Botafogo" },
        { id: "SAM-BAR", nome: "Hospital Samaritano Barra da Tijuca" }
    ],
    "REG-MG": [
        { id: "HER-BHZ", nome: "Hermes Pardini — Belo Horizonte (Matriz)" },
        { id: "HER-SAV", nome: "Hermes Pardini — Unidade Savassi" }
    ],
    "REG-BA": [
        { id: "LGM-SSA", nome: "Diagnosson a+ — Salvador" },
        { id: "PARD-SSA", nome: "Hermes Pardini — Salvador" }
    ],
    "REG-PE": [
        { id: "AMAIS-REC", nome: "a+ Medicina Diagnóstica — Recife" }
    ],
    "REG-PR": [
        { id: "AMAIS-CWB", nome: "a+ Medicina Diagnóstica — Curitiba" },
        { id: "DAPI-CWB", nome: "DAPI — Curitiba" }
    ],
    "REG-RS": [
        { id: "AMAIS-POA", nome: "a+ Medicina Diagnóstica — Porto Alegre" },
        { id: "SWS-POA", nome: "Sws — Porto Alegre" }
    ],
    "REG-ES": [
        { id: "MAC-VIX", nome: "Maternidade Santa Úsula / Rede Vitória" }
    ],
    "REG-DF": [
        { id: "SUM-BSB", nome: "Sabin Diagnóstico e Saúde — Brasília" }
    ],
    "REG-PA": [
        { id: "FLE-BEL", nome: "Laboratório Paulo Gama — Belém" }
    ],
    "REG-MA": [
        { id: "LGM-SLZ", nome: "Diagnosson a+ — São Luís" }
    ]
};