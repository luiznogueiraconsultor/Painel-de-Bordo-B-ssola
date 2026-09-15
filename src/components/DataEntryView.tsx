import React from 'react';
import { DashboardInputs, DashboardCalculations } from '../types';
import { PRESETS } from '../utils/calculations';
import { StatusBadge } from './StatusBadge';
import {
  Wrench,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  Info,
  Sparkles,
  RotateCcw,
  Save,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface DataEntryViewProps {
  inputs: DashboardInputs;
  setInputs: React.Dispatch<React.SetStateAction<DashboardInputs>>;
  calcs: DashboardCalculations;
  onReset: () => void;
}

export const DataEntryView: React.FC<DataEntryViewProps> = ({
  inputs,
  setInputs,
  calcs,
  onReset,
}) => {
  const handleChange = (field: keyof DashboardInputs, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [field]: typeof prev[field] === 'number' ? (isNaN(Number(value)) ? 0 : Number(value)) : value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Helper Banner */}
      <div className="bg-white rounded-xl border border-[#D5DDE2] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#102B3F] uppercase tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9A62E]" />
            Entrada de Dados do Cockpit
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Os campos azuis alimentam automaticamente todos os cálculos e semáforos do Painel de Bordo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded-lg border border-[#D5DDE2] text-[#6B7780] hover:text-[#102B3F] hover:bg-[#E9EEF1] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>
        </div>
      </div>

      {/* Main Form Sheet */}
      <div className="bg-white rounded-xl border border-[#D5DDE2] shadow-sm overflow-hidden">
        {/* Header table title */}
        <div className="bg-[#102B3F] text-white px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white">
              PLANILHA DE PARÂMETROS OPERACIONAIS
            </h3>
            <span className="text-[11px] text-[#9FC4D8]">
              Preencha os valores do período analisado para recalcular o painel em tempo real
            </span>
          </div>

          {/* Period input */}
          <div className="flex items-center gap-2 bg-[#183D52] px-3 py-1.5 rounded-lg border border-[#9FC4D8]/30">
            <Calendar className="w-4 h-4 text-[#D9A62E]" />
            <span className="text-xs text-[#9FC4D8] font-bold">Período:</span>
            <input
              type="text"
              value={inputs.periodo}
              onChange={(e) => handleChange('periodo', e.target.value)}
              className="bg-[#EAF3F8] text-[#173042] font-bold text-xs px-2.5 py-1 rounded border border-[#9FC4D8] focus:ring-2 focus:ring-[#D9A62E] focus:outline-none"
              placeholder="Ex: Semana 12/08 a 18/08/2026"
            />
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-8">
          {/* SECTION 1: QUADRANTE 1 */}
          <div className="space-y-3">
            <div className="bg-[#183D52] text-white px-4 py-2.5 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm uppercase">
                <Wrench className="w-4 h-4 text-[#D9A62E]" />
                <span>QUADRANTE 1 — PRODUTIVIDADE REAL (PÁTIO)</span>
              </div>
              <StatusBadge statusText={calcs.statusProdutividade} level={calcs.levelProdutividade} size="sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Field 1 */}
              <div className="bg-[#FBF8F0] p-3.5 rounded-lg border border-[#D5DDE2] flex flex-col justify-between">
                <label className="text-xs font-bold text-[#173042] block mb-1">
                  Nº de mecânicos produtivos
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={inputs.mecanicosProdutivos}
                    onChange={(e) => handleChange('mecanicosProdutivos', e.target.value)}
                    className="w-full bg-[#EAF3F8] border-2 border-[#9FC4D8] text-[#173042] text-lg font-black px-3 py-2 rounded-md focus:border-[#102B3F] focus:outline-none text-right"
                  />
                </div>
                <p className="text-[11px] text-[#6B7780] italic mt-2">
                  Quantidade de mecânicos efetivamente produtivos no período.
                </p>
              </div>

              {/* Field 2 */}
              <div className="bg-[#FBF8F0] p-3.5 rounded-lg border border-[#D5DDE2] flex flex-col justify-between">
                <label className="text-xs font-bold text-[#173042] block mb-1">
                  Horas contratadas / mecânico (CLT)
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={inputs.horasContratadasPorMecanico}
                    onChange={(e) => handleChange('horasContratadasPorMecanico', e.target.value)}
                    className="w-full bg-[#EAF3F8] border-2 border-[#9FC4D8] text-[#173042] text-lg font-black px-3 py-2 rounded-md focus:border-[#102B3F] focus:outline-none text-right"
                  />
                </div>
                <p className="text-[11px] text-[#6B7780] italic mt-2">
                  Padrão utilizado na metodologia: 176 h/mês.
                </p>
              </div>

              {/* Field 3 */}
              <div className="bg-[#FBF8F0] p-3.5 rounded-lg border border-[#D5DDE2] flex flex-col justify-between">
                <label className="text-xs font-bold text-[#173042] block mb-1">
                  Horas faturadas no período (soma O.S.)
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={inputs.horasFaturadas}
                    onChange={(e) => handleChange('horasFaturadas', e.target.value)}
                    className="w-full bg-[#EAF3F8] border-2 border-[#9FC4D8] text-[#173042] text-lg font-black px-3 py-2 rounded-md focus:border-[#102B3F] focus:outline-none text-right"
                  />
                </div>
                <p className="text-[11px] text-[#6B7780] italic mt-2">
                  Somatório das horas efetivamente faturadas nas O.S.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: QUADRANTE 2 */}
          <div className="space-y-3">
            <div className="bg-[#183D52] text-white px-4 py-2.5 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm uppercase">
                <DollarSign className="w-4 h-4 text-[#D9A62E]" />
                <span>QUADRANTE 2 — CPH REAL E ABSORÇÃO (FINANÇAS)</span>
              </div>
              <StatusBadge statusText={calcs.statusCph} level={calcs.levelCph} size="sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field 4 */}
              <div className="bg-[#FBF8F0] p-3.5 rounded-lg border border-[#D5DDE2] flex flex-col justify-between">
                <label className="text-xs font-bold text-[#173042] block mb-1">
                  CFR do Motor de Serviços no período (R$)
                </label>
                <div className="mt-2 relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-[#6B7780]">R$</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={inputs.cfrServicos}
                    onChange={(e) => handleChange('cfrServicos', e.target.value)}
                    className="w-full bg-[#EAF3F8] border-2 border-[#9FC4D8] text-[#173042] text-lg font-black pl-9 pr-3 py-2 rounded-md focus:border-[#102B3F] focus:outline-none text-right"
                  />
                </div>
                <p className="text-[11px] text-[#6B7780] italic mt-2">
                  Custo Fixo de Responsabilidade do pátio (aluguel, salários fixos, encargos, infraestrutura).
                </p>
              </div>

              {/* Automatic Calculated Preview Box */}
              <div className="bg-[#EAF3F8]/50 p-3.5 rounded-lg border border-[#9FC4D8] flex flex-col justify-between">
                <span className="text-xs font-bold text-[#102B3F] block">
                  Absorção Calculada em Tempo Real
                </span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-white p-2 rounded border border-[#D5DDE2]">
                    <span className="text-[10px] text-[#6B7780] block font-semibold">CPH Ideal</span>
                    <span className="text-sm font-bold text-[#102B3F]">
                      R$ {calcs.cphIdeal.toFixed(2)}/h
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-[#D5DDE2]">
                    <span className="text-[10px] text-[#6B7780] block font-semibold">CPH Real</span>
                    <span className="text-sm font-bold text-[#102B3F]">
                      R$ {calcs.cphReal.toFixed(2)}/h
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-[#6B7780] italic mt-2">
                  Variação calculada: <strong>{((calcs.variacaoCph || 0) * 100).toFixed(1)}%</strong>
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: QUADRANTE 3 */}
          <div className="space-y-3">
            <div className="bg-[#183D52] text-white px-4 py-2.5 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm uppercase">
                <TrendingUp className="w-4 h-4 text-[#D9A62E]" />
                <span>QUADRANTE 3 — MARGEM DE CONTRIBUIÇÃO POR MOTOR (COMERCIAL)</span>
              </div>
              <StatusBadge statusText={calcs.statusComercial} level={calcs.levelComercial} size="sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Field: Faturamento Serviços */}
              <div className="bg-[#FBF8F0] p-3.5 rounded-lg border border-[#D5DDE2]">
                <label className="text-xs font-bold text-[#173042] block mb-1">
                  Faturamento de Serviços no período (R$)
                </label>
                <div className="mt-2 relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-[#6B7780]">R$</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={inputs.fatServicos}
                    onChange={(e) => handleChange('fatServicos', e.target.value)}
                    className="w-full bg-[#EAF3F8] border-2 border-[#9FC4D8] text-[#173042] text-lg font-black pl-9 pr-3 py-2 rounded-md focus:border-[#102B3F] focus:outline-none text-right"
                  />
                </div>
                <p className="text-[11px] text-[#6B7780] italic mt-2">
                  Faturamento bruto de mão de obra realizada.
                </p>
              </div>

              {/* Field: Lucro Líquido Serviços */}
              <div className="bg-[#FBF8F0] p-3.5 rounded-lg border border-[#D5DDE2]">
                <label className="text-xs font-bold text-[#173042] block mb-1">
                  Lucro Líquido de Serviços (R$)
                </label>
                <div className="mt-2 relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-[#6B7780]">R$</span>
                  <input
                    type="number"
                    step="100"
                    value={inputs.lucroLiqServicos}
                    onChange={(e) => handleChange('lucroLiqServicos', e.target.value)}
                    className="w-full bg-[#EAF3F8] border-2 border-[#9FC4D8] text-[#173042] text-lg font-black pl-9 pr-3 py-2 rounded-md focus:border-[#102B3F] focus:outline-none text-right"
                  />
                </div>
                <p className="text-[11px] text-[#6B7780] italic mt-2">
                  Margem calculada: <strong>{((calcs.margemRealServicos || 0) * 100).toFixed(1)}%</strong>
                </p>
              </div>

              {/* Field: Meta Lucro Serviços (%) */}
              <div className="bg-[#FBF8F0] p-3.5 rounded-lg border border-[#D5DDE2]">
                <label className="text-xs font-bold text-[#173042] block mb-1">
                  Meta de Lucro de Serviços (%)
                </label>
                <div className="mt-2 relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={inputs.metaLucroServicos * 100}
                    onChange={(e) => handleChange('metaLucroServicos', Number(e.target.value) / 100)}
                    className="w-full bg-[#EAF3F8] border-2 border-[#9FC4D8] text-[#173042] text-lg font-black pr-8 pl-3 py-2 rounded-md focus:border-[#102B3F] focus:outline-none text-right"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-[#6B7780]">%</span>
                </div>
                <p className="text-[11px] text-[#6B7780] italic mt-2">
                  Meta definida no VHT (Ex: 18.0%).
                </p>
              </div>

              {/* Field: Faturamento Peças */}
              <div className="bg-[#FBF8F0] p-3.5 rounded-lg border border-[#D5DDE2]">
                <label className="text-xs font-bold text-[#173042] block mb-1">
                  Faturamento de Peças no período (R$)
                </label>
                <div className="mt-2 relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-[#6B7780]">R$</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={inputs.fatPecas}
                    onChange={(e) => handleChange('fatPecas', e.target.value)}
                    className="w-full bg-[#EAF3F8] border-2 border-[#9FC4D8] text-[#173042] text-lg font-black pl-9 pr-3 py-2 rounded-md focus:border-[#102B3F] focus:outline-none text-right"
                  />
                </div>
                <p className="text-[11px] text-[#6B7780] italic mt-2">
                  Total faturado na venda de autopeças e insumos.
                </p>
              </div>

              {/* Field: Custo Peças */}
              <div className="bg-[#FBF8F0] p-3.5 rounded-lg border border-[#D5DDE2]">
                <label className="text-xs font-bold text-[#173042] block mb-1">
                  Custo de Aquisição + Impostos (Peças)
                </label>
                <div className="mt-2 relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-[#6B7780]">R$</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={inputs.custoPecas}
                    onChange={(e) => handleChange('custoPecas', e.target.value)}
                    className="w-full bg-[#EAF3F8] border-2 border-[#9FC4D8] text-[#173042] text-lg font-black pl-9 pr-3 py-2 rounded-md focus:border-[#102B3F] focus:outline-none text-right"
                  />
                </div>
                <p className="text-[11px] text-[#6B7780] italic mt-2">
                  Lucro Bruto gerado: <strong>R$ {calcs.lucroBrutoPecas.toFixed(2)}</strong>
                </p>
              </div>

              {/* Field: Meta Cobertura Peças */}
              <div className="bg-[#FBF8F0] p-3.5 rounded-lg border border-[#D5DDE2]">
                <label className="text-xs font-bold text-[#173042] block mb-1">
                  Meta de Cobertura do Motor Peças (R$)
                </label>
                <div className="mt-2 relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-[#6B7780]">R$</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={inputs.metaCobPecas}
                    onChange={(e) => handleChange('metaCobPecas', e.target.value)}
                    className="w-full bg-[#EAF3F8] border-2 border-[#9FC4D8] text-[#173042] text-lg font-black pl-9 pr-3 py-2 rounded-md focus:border-[#102B3F] focus:outline-none text-right"
                  />
                </div>
                <p className="text-[11px] text-[#6B7780] italic mt-2">
                  Normalmente = CFR do Motor de Peças.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4: QUADRANTE 4 */}
          <div className="space-y-3">
            <div className="bg-[#183D52] text-white px-4 py-2.5 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm uppercase">
                <ShieldAlert className="w-4 h-4 text-[#D9A62E]" />
                <span>QUADRANTE 4 — QUALIDADE (RETRABALHO / REFUGO)</span>
              </div>
              <StatusBadge statusText={calcs.statusQualidade} level={calcs.levelQualidade} size="sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field: O.S. Faturadas */}
              <div className="bg-[#FBF8F0] p-3.5 rounded-lg border border-[#D5DDE2]">
                <label className="text-xs font-bold text-[#173042] block mb-1">
                  Nº de O.S. faturadas no período
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={inputs.osFaturadas}
                    onChange={(e) => handleChange('osFaturadas', e.target.value)}
                    className="w-full bg-[#EAF3F8] border-2 border-[#9FC4D8] text-[#173042] text-lg font-black px-3 py-2 rounded-md focus:border-[#102B3F] focus:outline-none text-right"
                  />
                </div>
                <p className="text-[11px] text-[#6B7780] italic mt-2">
                  Quantidade de ordens de serviço concluídas e entregues.
                </p>
              </div>

              {/* Field: Retornos em Garantia */}
              <div className="bg-[#FBF8F0] p-3.5 rounded-lg border border-[#D5DDE2]">
                <label className="text-xs font-bold text-[#173042] block mb-1">
                  Nº de retornos em garantia (retrabalho) no período
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={inputs.retornosGarantia}
                    onChange={(e) => handleChange('retornosGarantia', e.target.value)}
                    className="w-full bg-[#EAF3F8] border-2 border-[#9FC4D8] text-[#173042] text-lg font-black px-3 py-2 rounded-md focus:border-[#102B3F] focus:outline-none text-right"
                  />
                </div>
                <p className="text-[11px] text-[#6B7780] italic mt-2">
                  Taxa resultante: <strong>{((calcs.taxaRetrabalho || 0) * 100).toFixed(2)}%</strong> (Teto tolerável: ≤ 1.0%).
                </p>
              </div>
            </div>
          </div>

          {/* Legenda de Preenchimento matching openpyxl */}
          <div className="bg-[#FBF8F0] rounded-lg p-4 border border-[#D5DDE2] space-y-2">
            <h4 className="text-xs font-bold text-[#102B3F] uppercase tracking-wider">
              LEGENDA DE PREENCHIMENTO
            </h4>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#EAF3F8] border-2 border-[#9FC4D8]" />
                <span className="font-semibold text-[#173042]">Azul: Campo de entrada — preencher</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-white border border-[#D5DDE2]" />
                <span className="font-semibold text-[#173042]">Branco: Resultado calculado automaticamente</span>
              </div>
            </div>
            <p className="text-[11px] text-[#6B7780] italic pt-1">
              Os dados digitados nesta aba alimentam automaticamente o Painel de Bordo. Não é necessário alterar as fórmulas da aba Cálculos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
