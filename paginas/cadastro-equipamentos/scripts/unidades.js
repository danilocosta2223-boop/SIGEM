// Base de Unidades e Hospitais com IDs exclusivos e sem conflitos
const unidadesGrupoFleury = {
    "Hospitais e Unidades Hospitalares": [
        { id: "HSP-ACC", nome: "Hospital AC Camargo (Center / Pires Mota)" },
        { id: "HSP-SAB", nome: "Hospital Albert Sabin" },
        { id: "HSP-AMB", nome: "Hospital Ambesp" },
        { id: "HSP-CRZ", nome: "Hospital Cruz Azul" },
        { id: "HSP-DHP", nome: "Hospital Dona Helena Perini" },
        { id: "HSP-EVS", nome: "Hospital Evangélico de Sorocaba" },
        { id: "HSP-HCO", nome: "Hospital Hcor" },
        { id: "HSP-HMV", nome: "Hospital Moinhos de Vento" },
        { id: "HSP-MOR", nome: "Hospital Moriah" },
        { id: "HSP-NIP", nome: "Hospital Nipo-Brasileiro" },
        { id: "HSP-HPM", nome: "Hospital Pro Matre" },
        { id: "HSP-SAH", nome: "Hospital SAHA" },
        { id: "HSP-SAM", nome: "Hospital Samaritano" },
        { id: "HSP-SCT", nome: "Hospital Santa Catarina" },
        { id: "HSP-HSH", nome: "Hospital Santa Helena (DF)" },
        { id: "HSP-HSJ", nome: "Hospital Santa Joana (SP)" },
        { id: "HSP-SLU", nome: "Hospital Santa Lúcia (Norte / Sul - DF)" },
        { id: "HSP-HSM", nome: "Hospital Santa Maria" },
        { id: "HSP-HSR", nome: "Hospital Santa Rita" },
        { id: "HSP-HSV", nome: "Hospital Santa Virgínia" },
        { id: "HSP-HSC", nome: "Hospital São Camilo (Santana)" },
        { id: "HSP-SJQ", nome: "Hospital São Joaquim" },
        { id: "HSP-SJS", nome: "Hospital São José" },
        { id: "HSP-SVP", nome: "Hospital São Vicente de Paulo" },
        { id: "HSP-SLB", nome: "Hospital Sírio-Libanês (Itaim / Oeste / Brasília)" },
        { id: "HSP-TAC", nome: "Hospital Tacchini" },
        { id: "HSP-UNI", nome: "Hospital Unimed (Guarulhos / Salto-Itu / São Roque / São Lucas)" },
        { id: "HSP-VER", nome: "Hospital Vera Cruz" },
        { id: "HSP-HVA", nome: "Hospital Vitória Apart" },
        { id: "HSP-HYT", nome: "Hospital Yutaka Takeda" },
        { id: "HSP-H5O", nome: "Hospital 5 de Outubro" },
        { id: "HSP-HVC", nome: "Hospital H. E. Vasconcelos Central" }
    ],
    "Fleury": [
        { id: "FLY-AFR", nome: "Fleury A. Franco I e II / Shop. A. Franco" },
        { id: "FLY-ALP", nome: "Fleury Alphaville / Alameda Gabriel Monteiro da Silva / Alameda Jaú" },
        { id: "FLY-BRA", nome: "Fleury Brasil I e II / Braz Leme / Brooklin / Campo Belo / Cerro Corá / Chácara Klabin" },
        { id: "FLY-CMP", nome: "Fleury Campinas / Jundiaí / Osasco / Paraíso / Rochaverá / São Bernardo do Campo / Santo André I e II" },
        { id: "FLY-HIG", nome: "Fleury Higienópolis / Itaim / Moema / Morumbi / Panamby / Ponte Estaiada / Rep. Líbano I, II e III" },
        { id: "FLY-SUM", nome: "Fleury Sumaré / Vila Leopoldina / Vila Mariana / Villa Lobos / São Caetano do Sul" }
    ],
    "a+ Medicina Diagnóstica": [
        { id: "AMP-SPA", nome: "a+ SP (Alphaville, Angélica, Augusto Tolle, Berrini, Braz Leme, Brigadeiro, Campo Belo, Cantareira, Canário, Chácara Flora, Funchal, Granja Viana, Guarulhos, Heitor Penteado, Ipiranga, Itaim, Jundiaí, Lapa, Leôncio de Magalhães, Moema, Mooca, Morumbi, Mulher, Osasco, Paraíso, Pedroso de Morais, Queiroz Filho, Santo Amaro, Santo André, Tatuapé, Trianon Masp, Verbo Divino, Vila Andrade, Vila Mascote)" },
        { id: "AMP-PEA", nome: "a+ PE (Boa Viagem, Cabo, Casa Forte, Conselheiro Aguiar, Derby, Guararapes, Ilha do Leite, Jaqueira, Olinda, Rua da Hora)" },
        { id: "AMP-PRA", nome: "a+ PR (Alto da XV, Athena Maringá, Bacacheri, Batel, Bigorrilho, Capão Raso, Centro, Ecoville, Getúlio Vargas, João Bettega, Matriz, Nossa Saúde, São José dos Pinhais, Água Verde)" },
        { id: "AMP-BAA", nome: "a+ BA (Clivale Iguatemi / Lauro de Freitas / Paralela, Graça, Imbuí, Matatu, Paulo VI, Stella Maris)" },
        { id: "AMP-RJA", nome: "a+ RJ (Del Castilho, Tavares de Macedo)" }
    ],
    "Hermes Pardini & Labclass": [
        { id: "HPD-UNI", nome: "Hermes Pardini (Aimorés, Alípio de Melo, Alphaville, Anália Franco, Barreiro, Barroca, Belvedere, Bernardo Monteiro, Betânia, Betim, Buritis, Caetanópolis, Caiçara, Carijós, Castelo, Ceu Azul, Cidade Jardim, Cidade Nova, Contagem, Contorno, Coração Eucarístico, Eldorado, Floramar, Freguesia do Ó, Grajaú, Guarani, Guarulhos, Ibirité, Ipiranga, Itaim, Itaquera, Jardim Canadá, Justinópolis, Lapa, Mangabeiras, Milionários, Moema, Mogi das Cruzes, Niquelina, Nova Lima, Ouro Preto, Padre Eustáquio, Palmares, Pampulha, Pedro II, Pedro Leopoldo, Petrolândia, Planalto, Ressaca, Ribeirão das Neves, Sabará, Santa Amélia, Santa Inês, Santa Luzia, Santa Mônica, Santo Agostinho, Santo Amaro, São Bernardo, São Benedito, São Judas, São Paulo, Savassi, Sete Lagoas, Taboão da Serra, Tatuapé, Venda Nova, Vespasiano)" },
        { id: "LBC-UNI", nome: "Labclass (Buritis, Cidade Nova, Domicílio, Lourdes, Mangabeiras, São Lucas, Serena Mall)" }
    ],
    "Labs a+ & Felippe Mattoso (RJ)": [
        { id: "LAB-RJA", nome: "Labs a+ (Amaral Peixoto, Bangu, Barra Life, Bonsucesso, Campo Grande, Cambaúba, Carioca, Carolina Méier, Catete, Caxias, Copacabana, Debret, Dias da Cruz, Flamengo, Freguesia, Largo do Machado, Madureira, Mariz e Barros, Niterói, Penha, Piratininga, Recreio, Saens Pena, Santa Cruz, Santa Rosa, São Gonçalo, Taquara, Tijuca, Uruguai, Vila Isabel, Vila da Penha, XV de Novembro)" },
        { id: "FMT-RJA", nome: "Felippe Mattoso (Américas, Bambina, Botafogo, Centro, Jardim Botânico, Leblon, Mena Barreto, Samaritano)" }
    ],
    "Outras Marcas e Redes": [
        { id: "BIO-ES", nome: "Bioclínico (ES)" },
        { id: "PRE-ES", nome: "Pretti (ES)" },
        { id: "PZA-PA", nome: "Paulo Azevedo (PA)" },
        { id: "INL-MA", nome: "INLAB (MA)" },
        { id: "DMX-PE", nome: "Diagmax (PE)" },
        { id: "WNM-RS", nome: "Weinmann (RS)" },
        { id: "DRC-BR", nome: "Dr. Consulta" },
        { id: "NVM-BR", nome: "Novamed" },
        { id: "VTA-BR", nome: "Rede VITA" }
    ]
};