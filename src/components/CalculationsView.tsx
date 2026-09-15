import React, { useState } from 'react';
import { DashboardInputs, DashboardCalculations } from '../types';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatPercent, formatNumber } from '../utils/calculations';
import {
  Calculator,
  Search,
  CheckCircle,
  HelpCircle,
  Code2,
  Table,
  ArrowRight
} from 'lucide-react';

interface CalculationsViewProps {
  inputs: DashboardInputs;
  calcs: DashboardCalculations;
}

export const CalculationsView: React.FC<CalculationsViewProps> = ({ inputs, calcs }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const calcRows = [
    // Q1
    {
      quadrant: 'Q1 — Pátio',
      cell: 'C5',
      label: 'Horas disponíveis (capacidade instalada)',
      valueFormatted: `${formatNumber(calcs.horasDisponiveis, 1)} h`,
      formula: "='Entrada de Dados'!C8 * 'Entrada de Dados'!C9",
      calcExpanded: `${inputs.mecanicosProdutivos} mecânicos × ${inputs.horasContratadasPorMecanico} h/mês = ${calcs.horasDisponiveis} h`,
      note: 'Nº mecânicos × horas contratadas',
      type: 'calc',
    },
    {
      quadrant: 'Q1 — Pátio',
      cell: 'C6',
      label: 'Horas faturadas',
      valueFormatted: `${formatNumber(calcs.horasFaturadas, 1)} h`,
      formula: "='Entrada de Dados'!C10",
      calcExpanded: `Entrada direta: ${inputs.horasFaturadas} h`,
      note: 'Entrada informada das O.S.',
      type: 'input',
    },
    {
      quadrant: 'Q1 — Pátio',
      cell: 'C7',
      label: '% Produtividade Real',
      valueFormatted: formatPercent(calcs.produtividadeReal, 1),
      formula: '=IFERROR(C6/C5, 0)',
      calcExpanded: `${calcs.horasFaturadas} h ÷ ${calcs.horasDisponiveis} h = ${formatPercent(calcs.produtividadeReal, 2)}`,
      note: 'Horas faturadas ÷ horas disponíveis',
      type: 'calc',
    },
    {
      quadrant: 'Q1 — Pátio',
      cell: 'C8',
      label: 'Status Produtividade',
      valueFormatted: calcs.statusProdutividade,
      formula: '=IF(C7>=0.85,"OURO — VERDE", IF(C7>=0.70,"PRATA — AMARELO","BRONZE — VERMELHO"))',
      calcExpanded: `Critério: Ouro ≥ 85%, Prata 70–84%, Bronze < 70%`,
      note: 'Classificação de desempenho do pátio',
      type: 'status',
      level: calcs.levelProdutividade,
    },

    // Q2
    {
      quadrant: 'Q2 — Finanças',
      cell: 'C10',
      label: 'CFR Motor de Serviços',
      valueFormatted: formatCurrency(calcs.cfrServicos),
      formula: "='Entrada de Dados'!C14",
      calcExpanded: `Entrada direta: ${formatCurrency(inputs.cfrServicos)}`,
      note: 'Custo Fixo de Responsabilidade do pátio',
      type: 'input',
    },
    {
      quadrant: 'Q2 — Finanças',
      cell: 'C11',
      label: 'CPH Ideal',
      valueFormatted: `${formatCurrency(calcs.cphIdeal)}/h`,
      formula: '=IFERROR(C10/C5, 0)',
      calcExpanded: `${formatCurrency(calcs.cfrServicos)} ÷ ${calcs.horasDisponiveis} h = ${formatCurrency(calcs.cphIdeal)}/h`,
      note: 'CFR ÷ horas disponíveis',
      type: 'calc',
    },
    {
      quadrant: 'Q2 — Finanças',
      cell: 'C12',
      label: 'CPH Real',
      valueFormatted: `${formatCurrency(calcs.cphReal)}/h`,
      formula: '=IFERROR(C10/C6, 0)',
      calcExpanded: `${formatCurrency(calcs.cfrServicos)} ÷ ${calcs.horasFaturadas} h = ${formatCurrency(calcs.cphReal)}/h`,
      note: 'CFR ÷ horas faturadas',
      type: 'calc',
    },
    {
      quadrant: 'Q2 — Finanças',
      cell: 'C13',
      label: 'Variação CPH Real vs. Ideal',
      valueFormatted: formatPercent(calcs.variacaoCph, 1),
      formula: '=IFERROR(C12/C11 - 1, 0)',
      calcExpanded: `(${formatCurrency(calcs.cphReal)} ÷ ${formatCurrency(calcs.cphIdeal)}) - 1 = ${formatPercent(calcs.variacaoCph, 2)}`,
      note: 'CPH Real ÷ CPH Ideal − 1',
      type: 'calc',
    },
    {
      quadrant: 'Q2 — Finanças',
      cell: 'C14',
      label: 'Status CPH',
      valueFormatted: calcs.statusCph,
      formula: '=IF(C13<=0.05,"BLINDADO — VERDE", IF(C13<=0.15,"ATENÇÃO — AMARELO","ALERTA — VERMELHO"))',
      calcExpanded: `Critério: Até 5% = blindado, 5–15% = atenção, > 15% = alerta`,
      note: 'Capacidade de absorção de custo fixo',
      type: 'status',
      level: calcs.levelCph,
    },

    // Q3
    {
      quadrant: 'Q3 — Comercial',
      cell: 'C16',
      label: 'Faturamento de Serviços',
      valueFormatted: formatCurrency(calcs.fatServicos),
      formula: "='Entrada de Dados'!C18",
      calcExpanded: `Entrada direta: ${formatCurrency(inputs.fatServicos)}`,
      note: 'Entrada informada',
      type: 'input',
    },
    {
      quadrant: 'Q3 — Comercial',
      cell: 'C17',
      label: 'Lucro Líquido de Serviços',
      valueFormatted: formatCurrency(calcs.lucroLiqServicos),
      formula: "='Entrada de Dados'!C19",
      calcExpanded: `Entrada direta: ${formatCurrency(inputs.lucroLiqServicos)}`,
      note: 'Entrada informada',
      type: 'input',
    },
    {
      quadrant: 'Q3 — Comercial',
      cell: 'C18',
      label: 'Meta de Lucro de Serviços',
      valueFormatted: formatPercent(calcs.metaLucroServicos, 1),
      formula: "='Entrada de Dados'!C20",
      calcExpanded: `Entrada informada: ${formatPercent(inputs.metaLucroServicos, 1)}`,
      note: 'Meta definida no VHT',
      type: 'input',
    },
    {
      quadrant: 'Q3 — Comercial',
      cell: 'C19',
      label: 'Margem Real de Serviços',
      valueFormatted: formatPercent(calcs.margemRealServicos, 1),
      formula: '=IFERROR(C17/C16, 0)',
      calcExpanded: `${formatCurrency(calcs.lucroLiqServicos)} ÷ ${formatCurrency(calcs.fatServicos)} = ${formatPercent(calcs.margemRealServicos, 2)}`,
      note: 'Lucro Líquido ÷ Faturamento de Serviços',
      type: 'calc',
    },
    {
      quadrant: 'Q3 — Comercial',
      cell: 'C20',
      label: 'Motor Serviços bateu a meta?',
      valueFormatted: calcs.servicosBateuMeta ? 'SIM' : 'NÃO',
      formula: '=IF(C19>=C18, "SIM", "NÃO")',
      calcExpanded: `${formatPercent(calcs.margemRealServicos, 1)} ≥ ${formatPercent(calcs.metaLucroServicos, 1)}? ${calcs.servicosBateuMeta ? 'SIM' : 'NÃO'}`,
      note: 'Margem Real ≥ Meta',
      type: 'calc',
    },
    {
      quadrant: 'Q3 — Comercial',
      cell: 'C21',
      label: 'Faturamento de Peças',
      valueFormatted: formatCurrency(calcs.fatPecas),
      formula: "='Entrada de Dados'!C21",
      calcExpanded: `Entrada direta: ${formatCurrency(inputs.fatPecas)}`,
      note: 'Entrada informada',
      type: 'input',
    },
    {
      quadrant: 'Q3 — Comercial',
      cell: 'C22',
      label: 'Custo Aquisição + Impostos Peças',
      valueFormatted: formatCurrency(calcs.custoPecas),
      formula: "='Entrada de Dados'!C22",
      calcExpanded: `Entrada direta: ${formatCurrency(inputs.custoPecas)}`,
      note: 'Entrada informada',
      type: 'input',
    },
    {
      quadrant: 'Q3 — Comercial',
      cell: 'C23',
      label: 'Lucro Bruto de Peças / Cobertura Real',
      valueFormatted: formatCurrency(calcs.lucroBrutoPecas),
      formula: '=C21 - C22',
      calcExpanded: `${formatCurrency(calcs.fatPecas)} - ${formatCurrency(calcs.custoPecas)} = ${formatCurrency(calcs.lucroBrutoPecas)}`,
      note: 'Faturamento de Peças − Custo',
      type: 'calc',
    },
    {
      quadrant: 'Q3 — Comercial',
      cell: 'C24',
      label: 'Meta de Cobertura de Peças',
      valueFormatted: formatCurrency(calcs.metaCobPecas),
      formula: "='Entrada de Dados'!C23",
      calcExpanded: `Entrada direta: ${formatCurrency(inputs.metaCobPecas)}`,
      note: 'Meta de Cobertura do Motor Peças',
      type: 'input',
    },
    {
      quadrant: 'Q3 — Comercial',
      cell: 'C25',
      label: 'Motor Peças bateu a meta?',
      valueFormatted: calcs.pecasBateuMeta ? 'SIM' : 'NÃO',
      formula: '=IF(C23>=C24, "SIM", "NÃO")',
      calcExpanded: `${formatCurrency(calcs.lucroBrutoPecas)} ≥ ${formatCurrency(calcs.metaCobPecas)}? ${calcs.pecasBateuMeta ? 'SIM' : 'NÃO'}`,
      note: 'Cobertura Real ≥ Meta',
      type: 'calc',
    },
    {
      quadrant: 'Q3 — Comercial',
      cell: 'C26',
      label: 'Status Comercial',
      valueFormatted: calcs.statusComercial,
      formula: '=IF(AND(B20="SIM",B22="SIM"),"OS 2 MOTORES NA META — VERDE", IF(OR(B20="SIM",B22="SIM"),"1 MOTOR NA META — AMARELO","NENHUM MOTOR NA META — VERMELHO"))',
      calcExpanded: `Serviços: ${calcs.servicosBateuMeta ? 'SIM' : 'NÃO'}, Peças: ${calcs.pecasBateuMeta ? 'SIM' : 'NÃO'}`,
      note: 'Avalia o resultado conjunto dos dois motores',
      type: 'status',
      level: calcs.levelComercial,
    },

    // Q4
    {
      quadrant: 'Q4 — Qualidade',
      cell: 'B23',
      label: 'O.S. faturadas',
      valueFormatted: `${inputs.osFaturadas}`,
      formula: "=Entradas!B23",
      calcExpanded: `Entrada direta: ${inputs.osFaturadas}`,
      note: 'Total de O.S. finalizadas',
      type: 'input',
    },
    {
      quadrant: 'Q4 — Qualidade',
      cell: 'B24',
      label: 'Retornos em garantia',
      valueFormatted: `${inputs.retornosGarantia}`,
      formula: "=Entradas!B24",
      calcExpanded: `Entrada direta: ${inputs.retornosGarantia}`,
      note: 'Total de retornos com retrabalho',
      type: 'input',
    },
    {
      quadrant: 'Q4 — Qualidade',
      cell: 'B26',
      label: '% Retrabalho',
      valueFormatted: formatPercent(calcs.taxaRetrabalho, 1),
      formula: '=IFERROR(Entradas!B24/Entradas!B23, 0)',
      calcExpanded: `${inputs.retornosGarantia} ÷ ${inputs.osFaturadas} = ${formatPercent(calcs.taxaRetrabalho, 2)}`,
      note: 'Retornos ÷ O.S. faturadas',
      type: 'calc',
    },
    {
      quadrant: 'Q4 — Qualidade',
      cell: 'B28',
      label: 'Status Qualidade',
      valueFormatted: calcs.statusQualidade,
      formula: '=IF(B26<=0.01,"BLINDADO — VERDE", IF(B26<=0.02,"ATENÇÃO — AMARELO","ALERTA — VERMELHO"))',
      calcExpanded: `Critério: Até 1% tolerável (Blindado), 1–2% atenção, > 2% alerta`,
      note: 'Controle de qualidade e refugo',
      type: 'status',
      level: calcs.levelQualidade,
    },
  ];

  const filteredRows = calcRows.filter((r) => {
    if (!searchTerm) return true;
    const query = searchTerm.toLowerCase();
    return (
      r.label.toLowerCase().includes(query) ||
      r.cell.toLowerCase().includes(query) ||
      r.quadrant.toLowerCase().includes(query) ||
      r.formula.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Helper */}
      <div className="bg-white rounded-xl border border-[#D5DDE2] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#102B3F] uppercase tracking-wide flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#D9A62E]" />
            Memória de Cálculos & Auditoria de Fórmulas
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Mapeamento exato da aba "Cálculos" da planilha Excel com fórmulas abertas e valores intermediários calculados.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#6B7780] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por nome, célula, quadrante..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#EAF3F8] border border-[#9FC4D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A62E] text-[#173042]"
          />
        </div>
      </div>

      {/* Calculations Table */}
      <div className="bg-white rounded-xl border border-[#D5DDE2] shadow-sm overflow-hidden">
        <div className="bg-[#102B3F] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm uppercase tracking-wider">
            <Code2 className="w-4 h-4 text-[#D9A62E]" />
            <span>ABA: CÁLCULOS AUTOMÁTICOS</span>
          </div>
          <span className="text-[11px] text-[#9FC4D8]">
            {filteredRows.length} linhas de cálculo mapeadas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#183D52] text-white border-b border-[#102B3F]">
                <th className="py-2.5 px-3 font-bold uppercase text-[10px] tracking-wider w-20">Célula</th>
                <th className="py-2.5 px-3 font-bold uppercase text-[10px] tracking-wider w-28">Quadrante</th>
                <th className="py-2.5 px-4 font-bold uppercase text-[10px] tracking-wider">Indicador / Descrição</th>
                <th className="py-2.5 px-4 font-bold uppercase text-[10px] tracking-wider text-right w-44">Valor Calculado</th>
                <th className="py-2.5 px-4 font-bold uppercase text-[10px] tracking-wider">Fórmula Excel (openpyxl)</th>
                <th className="py-2.5 px-4 font-bold uppercase text-[10px] tracking-wider">Metodologia / Regra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D5DDE2]">
              {filteredRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-[#EAF3F8]/40 transition-colors ${
                    row.type === 'status' ? 'bg-[#FBF8F0]' : idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
                  }`}
                >
                  <td className="py-3 px-3 font-mono font-bold text-[#102B3F]">
                    <span className="bg-[#E9EEF1] text-[#102B3F] px-1.5 py-0.5 rounded text-[11px]">
                      {row.cell}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-[#6B7780] text-[11px]">
                    {row.quadrant}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#173042]">
                    {row.label}
                    <div className="text-[10px] text-[#6B7780] font-normal mt-0.5">
                      {row.calcExpanded}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {row.type === 'status' && row.level ? (
                      <StatusBadge statusText={row.valueFormatted} level={row.level} size="sm" />
                    ) : (
                      <span className="font-bold text-[#102B3F] text-sm font-mono">
                        {row.valueFormatted}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#183D52] bg-[#EAF3F8]/30 max-w-xs break-all">
                    {row.formula}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-[#6B7780] italic">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
