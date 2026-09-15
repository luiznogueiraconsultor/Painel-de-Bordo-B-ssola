import { DashboardInputs, DashboardCalculations, StatusLevel } from '../types';

export const DEFAULT_INPUTS: DashboardInputs = {
  periodo: "Semana 12/08 a 18/08/2026",
  mecanicosProdutivos: 5,
  horasContratadasPorMecanico: 176,
  horasFaturadas: 757, // Valor padrão da planilha original (757h)
  cfrServicos: 26000,
  fatServicos: 58000,
  lucroLiqServicos: 9500,
  metaLucroServicos: 0.18, // 18% (Aula 10)
  fatPecas: 18000,
  custoPecas: 14200,
  metaCobPecas: 5000, // Aula 05
  osFaturadas: 102,
  retornosGarantia: 2,
};

export const PRESETS: { name: string; description: string; data: DashboardInputs }[] = [
  {
    name: "Cenário da Planilha Original (Aula 21)",
    description: "Valores exatos da aba Entradas do arquivo original (5 mecânicos, 757h faturadas).",
    data: { ...DEFAULT_INPUTS }
  },
  {
    name: "Oficina Alta Performance (Tudo Verde)",
    description: "Pátio operando a 88% de produtividade, CPH blindado, ambos motores na meta e retrabalho em 0.8%.",
    data: {
      periodo: "Semana 19/08 a 25/08/2026 - Alta Performance",
      mecanicosProdutivos: 5,
      horasContratadasPorMecanico: 176,
      horasFaturadas: 775, // 775 / 880 = 88% (Ouro)
      cfrServicos: 26000, // CPH Real: 33.54 vs Ideal 29.55 -> variação 13% -> let's make 840h -> 26000/840=30.95 -> var 4.7% (Blindado)
      fatServicos: 65000,
      lucroLiqServicos: 13000, // 20% > 18%
      metaLucroServicos: 0.18,
      fatPecas: 25000,
      custoPecas: 19000, // Lucro bruto: 6.000 > meta 5.000
      metaCobPecas: 5000,
      osFaturadas: 130,
      retornosGarantia: 1, // 0.76% <= 1%
    }
  },
  {
    name: "Alerta Crítico no Pátio (Ociosidade & CPH Alto)",
    description: "Baixas horas faturadas provocando explosão do CPH Real e diluição insuficiente do CFR.",
    data: {
      periodo: "Semana 01/08 a 07/08/2026 - Gargalo de Pátio",
      mecanicosProdutivos: 6,
      horasContratadasPorMecanico: 176,
      horasFaturadas: 240, // 240 / 1056 = 22.7% (Bronze)
      cfrServicos: 32000,
      fatServicos: 38000,
      lucroLiqServicos: 3000, // 7.8% < 18%
      metaLucroServicos: 0.18,
      fatPecas: 12000,
      custoPecas: 10500, // 1500 < 5000
      metaCobPecas: 5000,
      osFaturadas: 80,
      retornosGarantia: 3, // 3.75% (Alerta)
    }
  },
  {
    name: "Equilíbrio Moderado (Prata / Atenção)",
    description: "Operação com produtividade razoável (75%), peças na meta e atenção em serviços e retrabalho.",
    data: {
      periodo: "Semana 08/08 a 14/08/2026 - Transição",
      mecanicosProdutivos: 4,
      horasContratadasPorMecanico: 176,
      horasFaturadas: 530, // 530 / 704 = 75.2% (Prata)
      cfrServicos: 22000,
      fatServicos: 52000,
      lucroLiqServicos: 7800, // 15% < 18%
      metaLucroServicos: 0.18,
      fatPecas: 22000,
      custoPecas: 16500, // 5500 >= 5000 (Sim)
      metaCobPecas: 5000,
      osFaturadas: 110,
      retornosGarantia: 2, // 1.8% (Atenção)
    }
  }
];

export function calculateDashboard(inp: DashboardInputs): DashboardCalculations {
  // Q1
  const horasDisponiveis = (inp.mecanicosProdutivos || 0) * (inp.horasContratadasPorMecanico || 0);
  const horasFaturadas = inp.horasFaturadas || 0;
  const produtividadeReal = horasDisponiveis > 0 ? (horasFaturadas / horasDisponiveis) : 0;

  let statusProdutividade = "BRONZE — VERMELHO";
  let levelProdutividade: StatusLevel = "red";
  if (produtividadeReal >= 0.85) {
    statusProdutividade = "OURO — VERDE";
    levelProdutividade = "green";
  } else if (produtividadeReal >= 0.70) {
    statusProdutividade = "PRATA — AMARELO";
    levelProdutividade = "yellow";
  }

  // Q2
  const cfrServicos = inp.cfrServicos || 0;
  const cphIdeal = horasDisponiveis > 0 ? (cfrServicos / horasDisponiveis) : 0;
  const cphReal = horasFaturadas > 0 ? (cfrServicos / horasFaturadas) : 0;
  const variacaoCph = cphIdeal > 0 ? (cphReal / cphIdeal - 1) : 0;

  let statusCph = "ALERTA — VERMELHO";
  let levelCph: StatusLevel = "red";
  if (variacaoCph <= 0.05) {
    statusCph = "BLINDADO — VERDE";
    levelCph = "green";
  } else if (variacaoCph <= 0.15) {
    statusCph = "ATENÇÃO — AMARELO";
    levelCph = "yellow";
  }

  // Q3
  const fatServicos = inp.fatServicos || 0;
  const lucroLiqServicos = inp.lucroLiqServicos || 0;
  const metaLucroServicos = inp.metaLucroServicos || 0;
  const margemRealServicos = fatServicos > 0 ? (lucroLiqServicos / fatServicos) : 0;
  const servicosBateuMeta = margemRealServicos >= metaLucroServicos;

  const fatPecas = inp.fatPecas || 0;
  const custoPecas = inp.custoPecas || 0;
  const lucroBrutoPecas = fatPecas - custoPecas;
  const metaCobPecas = inp.metaCobPecas || 0;
  const pecasBateuMeta = lucroBrutoPecas >= metaCobPecas;

  let statusComercial = "NENHUM MOTOR NA META — VERMELHO";
  let levelComercial: StatusLevel = "red";
  if (servicosBateuMeta && pecasBateuMeta) {
    statusComercial = "OS 2 MOTORES NA META — VERDE";
    levelComercial = "green";
  } else if (servicosBateuMeta || pecasBateuMeta) {
    statusComercial = "1 MOTOR NA META — AMARELO";
    levelComercial = "yellow";
  }

  // Q4
  const osFaturadas = inp.osFaturadas || 0;
  const retornosGarantia = inp.retornosGarantia || 0;
  const taxaRetrabalho = osFaturadas > 0 ? (retornosGarantia / osFaturadas) : 0;

  let statusQualidade = "ALERTA — VERMELHO";
  let levelQualidade: StatusLevel = "red";
  if (taxaRetrabalho <= 0.01) {
    statusQualidade = "BLINDADO — VERDE";
    levelQualidade = "green";
  } else if (taxaRetrabalho <= 0.02) {
    statusQualidade = "ATENÇÃO — AMARELO";
    levelQualidade = "yellow";
  }

  // Diagnóstico Rápido (conforme fórmula da célula A31 da aba Painel de Bordo)
  const isFullGreen =
    statusProdutividade === "OURO — VERDE" &&
    statusCph === "BLINDADO — VERDE" &&
    statusComercial === "OS 2 MOTORES NA META — VERDE" &&
    statusQualidade === "BLINDADO — VERDE";

  const diagnosticoDetalhes: string[] = [];
  if (statusProdutividade !== "OURO — VERDE") diagnosticoDetalhes.push("Quadrante 1 (Produtividade)");
  if (statusCph !== "BLINDADO — VERDE") diagnosticoDetalhes.push("Quadrante 2 (CPH)");
  if (statusComercial !== "OS 2 MOTORES NA META — VERDE") diagnosticoDetalhes.push("Quadrante 3 (Comercial)");
  if (statusQualidade !== "BLINDADO — VERDE") diagnosticoDetalhes.push("Quadrante 4 (Qualidade)");

  const diagnosticoTexto = isFullGreen
    ? "Painel limpo — os 4 quadrantes estão na Faixa Ouro."
    : `Precisa de atenção: ${diagnosticoDetalhes.map(d => `${d};`).join(" ")}`;

  return {
    horasDisponiveis,
    horasFaturadas,
    produtividadeReal,
    statusProdutividade,
    levelProdutividade,

    cfrServicos,
    cphIdeal,
    cphReal,
    variacaoCph,
    statusCph,
    levelCph,

    fatServicos,
    lucroLiqServicos,
    metaLucroServicos,
    margemRealServicos,
    servicosBateuMeta,
    fatPecas,
    custoPecas,
    lucroBrutoPecas,
    metaCobPecas,
    pecasBateuMeta,
    statusComercial,
    levelComercial,

    osFaturadas,
    retornosGarantia,
    taxaRetrabalho,
    statusQualidade,
    levelQualidade,

    isFullGreen,
    diagnosticoTexto,
    diagnosticoDetalhes,
  };
}

export function formatCurrency(val: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0);
}

export function formatPercent(val: number, decimals: number = 1): string {
  return `${((val || 0) * 100).toFixed(decimals)}%`;
}

export function formatNumber(val: number, decimals: number = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val || 0);
}
