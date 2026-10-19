/**
 * unidades.js
 * Mapeamento completo de Unidades do Grupo Fleury agrupadas por Regional
 * Utilizado para preenchimento dinâmico e salvamento de ID/Nome no cadastro de ativos.
 */
const unidadesPorRegional = {
    "REG-SP": [
        { id: "HSP-ACC", nome: "Hospital AC Camargo" },
        { id: "HSP-HCO", nome: "Hospital Hcor" },
        { id: "HSP-SAM", nome: "Hospital Samaritano Higienópolis" },
        { id: "FLY-ALP", nome: "Fleury Alphaville / Jaú" },
        { id: "FLY-HIG", nome: "Fleury Higienópolis / Itaim / Moema" },
        { id: "AMP-SPA", nome: "a+ Medicina Diagnóstica — São Paulo" }
    ],
    "REG-RJ": [
        { id: "LAB-RJA", nome: "Labs a+ — Rio de Janeiro" },
        { id: "FMT-RJA", nome: "Felippe Mattoso — Botafogo / Centro" },
        { id: "HSP-SAM-BOT", nome: "Hospital Samaritano Botafogo" },
        { id: "HSP-SAM-BAR", nome: "Hospital Samaritano Barra da Tijuca" }
    ],
    "REG-MG": [
        { id: "HPD-UNI", nome: "Hermes Pardini — Belo Horizonte (Matriz e Unidades)" },
        { id: "LBC-UNI", nome: "Labclass — Belo Horizonte" }
    ],
    "REG-BA": [
        { id: "AMP-BAA", nome: "a+ / Diagnosson — Salvador" }
    ],
    "REG-PE": [
        { id: "AMP-PEA", nome: "a+ Medicina Diagnóstica — Recife" },
        { id: "DMX-PE", nome: "Diagmax — Pernambuco" }
    ],
    "REG-PR": [
        { id: "AMP-PRA", nome: "a+ Medicina Diagnóstica — Curitiba" },
        { id: "DAPI-CWB", nome: "DAPI — Curitiba" }
    ],
    "REG-RS": [
        { id: "WNM-RS", nome: "Weinmann — Porto Alegre" }
    ],
    "REG-ES": [
        { id: "BIO-ES", nome: "Bioclínico — Espírito Santo" },
        { id: "PRE-ES", nome: "Pretti — Espírito Santo" }
    ],
    "REG-DF": [
        { id: "HSP-HSH", nome: "Hospital Santa Helena — Distrito Federal" },
        { id: "HSP-SLU", nome: "Hospital Santa Lúcia — Distrito Federal" }
    ],
    "REG-PA": [
        { id: "PZA-PA", nome: "Paulo Azevedo — Pará" }
    ],
    "REG-MA": [
        { id: "INL-MA", nome: "INLAB — Maranhão" }
    ]
};