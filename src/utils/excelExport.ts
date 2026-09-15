import * as XLSX from 'xlsx';
import { DashboardInputs, DashboardCalculations } from '../types';
import { formatCurrency, formatPercent, formatNumber } from './calculations';

export function exportCockpitToExcel(inputs: DashboardInputs, calcs: DashboardCalculations, fileName: string = 'Painel_de_Bordo_do_Gestor.xlsx') {
  const wb = XLSX.utils.book_new();

  // 1. ABA: COMO USAR
  const comoUsarData = [
    ['PAINEL DE BORDO DO GESTOR — Método Bússola'],
    ['Versão do painel da Aula 21 (Módulo 6) — Metodologia dos 4 Quadrantes da Bússola Gestão Automotiva.'],
    [''],
    ['COMO USAR'],
    ['1. Vá na aba "Entradas" e preencha as células com os números do seu fechamento (semana ou mês).'],
    ['2. Vá na aba "Painel de Bordo" — os 4 quadrantes e o semáforo de cor atualizam sozinhos.'],
    ['3. As células vêm com os dados reais salvos no seu painel web.'],
    ['4. Repita a cada fechamento (semanal ou mensal) para acompanhar a evolução.'],
    [''],
    ['OS 4 QUADRANTES (mesma lógica da Aula 21)'],
    ['Quadrante 1 — Termômetro da Produtividade Real: horas faturadas ÷ horas disponíveis do pátio.'],
    ['Quadrante 2 — CPH Real e Absorção de Estrutura: quanto o seu Custo por Hora real se afasta do CPH Ideal.'],
    ['Quadrante 3 — Margem de Contribuição por Motor: Serviços bateu a meta de lucro? Peças bateu a Meta de Cobertura?'],
    ['Quadrante 4 — Índice de Refugo Operacional: % de carros que voltaram em garantia (retrabalho).'],
    [''],
    ['METAS DE VIGÍLIA (LEGENDA DE CORES)'],
    ['• Quadrante 1 (Produtividade): Ouro ≥ 85% | Prata 70–84% | Bronze < 70%'],
    ['• Quadrante 2 (CPH Real vs Ideal): Até 5% = Blindado | 5–15% = Atenção | Acima de 15% = Alerta'],
    ['• Quadrante 3 (Comercial): Ambos Motores na Meta = Verde | 1 Motor na Meta = Amarelo | Nenhum = Vermelho'],
    ['• Quadrante 4 (Qualidade): Até 1% = Blindado | 1–2% = Atenção | Acima de 2% = Alerta'],
  ];
  const wsComoUsar = XLSX.utils.aoa_to_sheet(comoUsarData);

  // 2. ABA: ENTRADAS
  const entradasData = [
    ['ENTRADAS — preencha a cada fechamento', '', 'REFERÊNCIA METODOLÓGICA'],
    ['Valores do período em análise gerados pelo Painel de Bordo do Gestor.', '', ''],
    ['', '', ''],
    ['Período de referência', inputs.periodo, ''],
    ['', '', ''],
    ['QUADRANTE 1 — PRODUTIVIDADE REAL (PÁTIO)', '', ''],
    ['Nº de mecânicos produtivos', inputs.mecanicosProdutivos, 'Quantidade de mecânicos produtivos no pátio'],
    ['Horas contratadas por mecânico no mês (padrão CLT)', inputs.horasContratadasPorMecanico, 'Aula 02: padrão = 176h/mês'],
    ['Horas faturadas no período (soma real das O.S.)', inputs.horasFaturadas, 'Soma das horas faturadas nas O.S.'],
    ['', '', ''],
    ['QUADRANTE 2 — CPH REAL E ABSORÇÃO (FINANÇAS)', '', ''],
    ['CFR do Motor de Serviços no período (R$)', inputs.cfrServicos, 'Aula 05: Custo Fixo de Responsabilidade do pátio'],
    ['', '', ''],
    ['QUADRANTE 3 — MARGEM DE CONTRIBUIÇÃO POR MOTOR (COMERCIAL)', '', ''],
    ['Faturamento de Serviços no período (R$)', inputs.fatServicos, 'Faturamento bruto de mão de obra'],
    ['Lucro Líquido de Serviços no período (R$)', inputs.lucroLiqServicos, 'Lucro líquido do setor de serviços'],
    ['Meta de Lucro de Serviços (%)', `${(inputs.metaLucroServicos * 100).toFixed(1)}%`, 'Aula 10: Meta definida no seu VHT'],
    ['Faturamento de Peças no período (R$)', inputs.fatPecas, 'Faturamento bruto de autopeças'],
    ['Custo de Aquisição + Impostos das Peças vendidas (R$)', inputs.custoPecas, 'CMV + tributação sobre peças'],
    ['Meta de Cobertura do Motor de Peças no período (R$)', inputs.metaCobPecas, 'Aula 05: Normalmente = CFR do Motor de Peças'],
    ['', '', ''],
    ['QUADRANTE 4 — QUALIDADE (RETRABALHO)', '', ''],
    ['Nº de O.S. faturadas no período', inputs.osFaturadas, 'Total de O.S. finalizadas e faturadas'],
    ['Nº de retornos em garantia (retrabalho) no período', inputs.retornosGarantia, 'Total de retornos com retrabalho ou garantia'],
  ];
  const wsEntradas = XLSX.utils.aoa_to_sheet(entradasData);

  // 3. ABA: PAINEL DE BORDO (Visão Consolidada)
  const painelData = [
    ['PAINEL DE BORDO DO GESTOR — Visão Consolidada', '', '', ''],
    ['Período:', inputs.periodo, '', ''],
    ['', '', '', ''],
    ['QUADRANTE 1 — TERMÔMETRO DA PRODUTIVIDADE REAL (O PÁTIO)', '', '', ''],
    ['Horas disponíveis (capacidade instalada)', `${formatNumber(calcs.horasDisponiveis, 1)} h`, 'Nº mecânicos × horas contratadas', ''],
    ['Horas faturadas no período', `${formatNumber(calcs.horasFaturadas, 1)} h`, 'Soma real das O.S.', ''],
    ['% Produtividade Real', formatPercent(calcs.produtividadeReal, 1), 'Horas faturadas ÷ horas disponíveis', ''],
    ['Meta de Vigília: Ouro ≥ 85% · Prata 70–84% · Bronze < 70%', '', '', ''],
    ['Status', calcs.statusProdutividade, '', ''],
    ['', '', '', ''],
    ['QUADRANTE 2 — CPH REAL E ABSORÇÃO DE ESTRUTURA (FINANÇAS)', '', '', ''],
    ['CPH Ideal (CFR ÷ horas disponíveis)', `${formatCurrency(calcs.cphIdeal)}/h`, 'CFR ÷ horas disponíveis', ''],
    ['CPH Real (CFR ÷ horas faturadas)', `${formatCurrency(calcs.cphReal)}/h`, 'CFR ÷ horas faturadas', ''],
    ['Variação CPH Real vs. Ideal', formatPercent(calcs.variacaoCph, 1), 'CPH Real ÷ CPH Ideal − 1', ''],
    ['Meta de Vigília: até 5% = blindado · 5–15% = atenção · acima de 15% = alerta', '', '', ''],
    ['Status', calcs.statusCph, '', ''],
    ['', '', '', ''],
    ['QUADRANTE 3 — MARGEM DE CONTRIBUIÇÃO POR MOTOR (COMERCIAL)', '', '', ''],
    ['Margem Real de Serviços', formatPercent(calcs.margemRealServicos, 1), 'Lucro Líq. ÷ Faturamento Serviços', ''],
    ['Motor Serviços bateu a meta de lucro?', calcs.servicosBateuMeta ? 'SIM' : 'NÃO', `Meta: ${formatPercent(calcs.metaLucroServicos, 1)}`, ''],
    ['Lucro Bruto de Peças no período', formatCurrency(calcs.lucroBrutoPecas), 'Fat. Peças − Custo Peças', ''],
    ['Motor Peças bateu a Meta de Cobertura?', calcs.pecasBateuMeta ? 'SIM' : 'NÃO', `Meta: ${formatCurrency(calcs.metaCobPecas)}`, ''],
    ['Status', calcs.statusComercial, '', ''],
    ['', '', '', ''],
    ['QUADRANTE 4 — ÍNDICE DE REFUGO OPERACIONAL (QUALIDADE)', '', '', ''],
    ['% de Retrabalho (retornos em garantia)', formatPercent(calcs.taxaRetrabalho, 1), 'Retornos ÷ O.S. faturadas', ''],
    ['Meta de Vigília: teto tolerável = 1% · 1–2% = atenção · acima de 2% = alerta', '', '', ''],
    ['Status', calcs.statusQualidade, '', ''],
    ['', '', '', ''],
    ['DIAGNÓSTICO RÁPIDO', '', '', ''],
    [calcs.diagnosticoTexto, '', '', ''],
  ];
  const wsPainel = XLSX.utils.aoa_to_sheet(painelData);

  // Set column widths
  wsComoUsar['!cols'] = [{ wch: 80 }];
  wsEntradas['!cols'] = [{ wch: 52 }, { wch: 25 }, { wch: 55 }];
  wsPainel['!cols'] = [{ wch: 55 }, { wch: 28 }, { wch: 45 }];

  XLSX.utils.book_append_sheet(wb, wsComoUsar, 'Como Usar');
  XLSX.utils.book_append_sheet(wb, wsEntradas, 'Entradas');
  XLSX.utils.book_append_sheet(wb, wsPainel, 'Painel de Bordo');

  XLSX.writeFile(wb, fileName);
}
