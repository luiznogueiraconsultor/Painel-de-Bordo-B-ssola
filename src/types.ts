export interface DashboardInputs {
  periodo: string;
  // Quadrante 1 - Produtividade
  mecanicosProdutivos: number; // C8
  horasContratadasPorMecanico: number; // C9
  horasFaturadas: number; // C10
  // Quadrante 2 - CPH e Absorção
  cfrServicos: number; // C14
  // Quadrante 3 - Margem de Contribuição por Motor
  fatServicos: number; // C18
  lucroLiqServicos: number; // C19
  metaLucroServicos: number; // C20 (e.g. 0.18)
  fatPecas: number; // C21
  custoPecas: number; // C22
  metaCobPecas: number; // C23
  // Quadrante 4 - Qualidade / Retrabalho
  osFaturadas: number; // C26
  retornosGarantia: number; // C27
}

export type StatusLevel = 'green' | 'yellow' | 'red';

export interface DashboardCalculations {
  // Q1
  horasDisponiveis: number; // C5 = C8 * C9
  horasFaturadas: number; // C6 = C10
  produtividadeReal: number; // C7 = C6 / C5
  statusProdutividade: string; // C8: OURO — VERDE / PRATA — AMARELO / BRONZE — VERMELHO
  levelProdutividade: StatusLevel;

  // Q2
  cfrServicos: number; // C10 = C14
  cphIdeal: number; // C11 = C10 / C5
  cphReal: number; // C12 = C10 / C6
  variacaoCph: number; // C13 = (C12 / C11) - 1
  statusCph: string; // C14: BLINDADO — VERDE / ATENÇÃO — AMARELO / ALERTA — VERMELHO
  levelCph: StatusLevel;

  // Q3
  fatServicos: number; // C16 = C18
  lucroLiqServicos: number; // C17 = C19
  metaLucroServicos: number; // C18 = C20
  margemRealServicos: number; // C19 = C17 / C16
  servicosBateuMeta: boolean; // C20: SIM / NÃO
  fatPecas: number; // C21 = C21
  custoPecas: number; // C22 = C22
  lucroBrutoPecas: number; // C23 = C21 - C22
  metaCobPecas: number; // C24 = C23
  pecasBateuMeta: boolean; // C25: SIM / NÃO
  statusComercial: string; // C26: AMBOS NA META — VERDE / UM MOTOR NA META — AMARELO / NENHUM MOTOR NA META — VERMELHO
  levelComercial: StatusLevel;

  // Q4
  osFaturadas: number; // C28 = C26
  retornosGarantia: number; // C29 = C27
  taxaRetrabalho: number; // C30 = C29 / C28
  statusQualidade: string; // C31: DENTRO DO TETO — VERDE / ATENÇÃO — AMARELO / ALERTA — VERMELHO
  levelQualidade: StatusLevel;

  // Diagnóstico Consolidado
  isFullGreen: boolean;
  diagnosticoTexto: string;
  diagnosticoDetalhes: string[];
}

export interface SavedRecord {
  id: string;
  timestamp: number;
  periodo: string;
  inputs: DashboardInputs;
  notes?: string;
}
