import React, { useState } from 'react';
import { DashboardInputs, DashboardCalculations } from '../types';
import { calculateDashboard, formatCurrency, formatPercent, formatNumber } from '../utils/calculations';
import { StatusBadge } from './StatusBadge';
import { GaugeMeter } from './GaugeMeter';
import {
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  DollarSign,
  Wrench,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SimulatorViewProps {
  currentInputs: DashboardInputs;
  onApplyToMain: (newInputs: DashboardInputs) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  currentInputs,
  onApplyToMain,
}) => {
  const [simInputs, setSimInputs] = useState<DashboardInputs>({ ...currentInputs });

  const currentCalcs = calculateDashboard(currentInputs);
  const simCalcs = calculateDashboard(simInputs);

  const handleSliderChange = (field: keyof DashboardInputs, value: number) => {
    setSimInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResetToCurrent = () => {
    setSimInputs({ ...currentInputs });
  };

  const handleSimulateTargetOuro = () => {
    // To reach Ouro (85%): horasFaturadas = horasDisponiveis * 0.85
    const neededHours = Math.ceil(simCalcs.horasDisponiveis * 0.85);
    setSimInputs((prev) => ({
      ...prev,
      horasFaturadas: neededHours,
    }));
    confetti({ particleCount: 50, spread: 50 });
  };

  const handleSimulateBlindarCph = () => {
    // To blind CPH (var <= 5%): CPH Real <= CPH Ideal * 1.05
    // CFR / horasFaturadas <= (CFR / horasDisponiveis) * 1.05
    // horasFaturadas >= horasDisponiveis / 1.05 ~ 95.2% das horas disponíveis
    const neededHours = Math.ceil(simCalcs.horasDisponiveis / 1.04);
    setSimInputs((prev) => ({
      ...prev,
      horasFaturadas: neededHours,
    }));
  };

  const handleSimulateZeroRetrabalho = () => {
    setSimInputs((prev) => ({
      ...prev,
      retornosGarantia: 0,
    }));
  };

  const handleApply = () => {
    onApplyToMain(simInputs);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-[#D5DDE2] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#102B3F] uppercase tracking-wide flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#D9A62E]" />
            Simulador de Metas & Sensibilidade Operacional (What-If)
          </h2>
          <p className="text-xs text-[#6B7780] mt-0.5">
            Ajuste os controles deslizantes para simular cenários futuros, testar metas e verificar o impacto financeiro imediato.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleResetToCurrent}
            className="px-3 py-1.5 rounded-lg border border-[#D5DDE2] text-[#6B7780] hover:text-[#102B3F] hover:bg-[#E9EEF1] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetar ao Atual</span>
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#D9A62E] to-[#b38318] text-[#102B3F] hover:from-[#e5b138] hover:to-[#c29121] text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Aplicar Cenário ao Painel</span>
          </button>
        </div>
      </div>

      {/* Quick Target Solver Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={handleSimulateTargetOuro}
          className="p-3 bg-white hover:bg-[#E8F5E9]/50 border border-[#2E7D32]/30 rounded-xl text-left transition-all group flex items-start gap-3 shadow-xs cursor-pointer"
        >
          <span className="p-2 rounded-lg bg-[#E8F5E9] text-[#2E7D32] group-hover:scale-110 transition-transform">
            <Wrench className="w-4 h-4" />
          </span>
          <div>
            <span className="text-xs font-bold text-[#102B3F] block">
              🎯 Atingir Produtividade Ouro (≥85%)
            </span>
            <span className="text-[11px] text-[#6B7780]">
              Calcula automaticamente as horas necessárias para bater a meta de pátio.
            </span>
          </div>
        </button>

        <button
          onClick={handleSimulateBlindarCph}
          className="p-3 bg-white hover:bg-[#E8F5E9]/50 border border-[#2E7D32]/30 rounded-xl text-left transition-all group flex items-start gap-3 shadow-xs cursor-pointer"
        >
          <span className="p-2 rounded-lg bg-[#E8F5E9] text-[#2E7D32] group-hover:scale-110 transition-transform">
            <DollarSign className="w-4 h-4" />
          </span>
          <div>
            <span className="text-xs font-bold text-[#102B3F] block">
              🛡️ Blindar CPH (Variação ≤5%)
            </span>
            <span className="text-[11px] text-[#6B7780]">
              Ajusta o faturamento de horas para diluição ideal do CFR.
            </span>
          </div>
        </button>

        <button
          onClick={handleSimulateZeroRetrabalho}
          className="p-3 bg-white hover:bg-[#E8F5E9]/50 border border-[#2E7D32]/30 rounded-xl text-left transition-all group flex items-start gap-3 shadow-xs cursor-pointer"
        >
          <span className="p-2 rounded-lg bg-[#E8F5E9] text-[#2E7D32] group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-4 h-4" />
          </span>
          <div>
            <span className="text-xs font-bold text-[#102B3F] block">
              ⭐ Refugo Zero (0 Retornos)
            </span>
            <span className="text-[11px] text-[#6B7780]">
              Zera garantias para simular eficiência operacional perfeita.
            </span>
          </div>
        </button>
      </div>

      {/* Simulator Interface: Sliders on Left, Live Comparison on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Column (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#D5DDE2] shadow-sm p-4 sm:p-6 space-y-6">
          <h3 className="text-xs font-bold text-[#102B3F] uppercase tracking-wider border-b border-[#D5DDE2] pb-2">
            Controles de Simulação Interativos
          </h3>

          {/* Slider 1: Horas Faturadas */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#173042]">Horas Faturadas no Período</span>
              <span className="font-mono font-bold text-sm text-[#102B3F] bg-[#EAF3F8] px-2 py-0.5 rounded border border-[#9FC4D8]">
                {simInputs.horasFaturadas} h
              </span>
            </div>
            <input
              type="range"
              min="50"
              max={Math.max(1200, simCalcs.horasDisponiveis * 1.3)}
              step="5"
              value={simInputs.horasFaturadas}
              onChange={(e) => handleSliderChange('horasFaturadas', Number(e.target.value))}
              className="w-full h-2 bg-[#E9EEF1] rounded-lg appearance-none cursor-pointer accent-[#102B3F]"
            />
            <div className="flex justify-between text-[10px] text-[#6B7780]">
              <span>50 h</span>
              <span>Atual: {currentInputs.horasFaturadas} h</span>
              <span>{Math.round(simCalcs.horasDisponiveis * 1.3)} h</span>
            </div>
          </div>

          {/* Slider 2: Mecânicos Produtivos */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#173042]">Nº de Mecânicos Produtivos</span>
              <span className="font-mono font-bold text-sm text-[#102B3F] bg-[#EAF3F8] px-2 py-0.5 rounded border border-[#9FC4D8]">
                {simInputs.mecanicosProdutivos} mecânicos ({simCalcs.horasDisponiveis} h disp.)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={simInputs.mecanicosProdutivos}
              onChange={(e) => handleSliderChange('mecanicosProdutivos', Number(e.target.value))}
              className="w-full h-2 bg-[#E9EEF1] rounded-lg appearance-none cursor-pointer accent-[#102B3F]"
            />
            <div className="flex justify-between text-[10px] text-[#6B7780]">
              <span>1</span>
              <span>Atual: {currentInputs.mecanicosProdutivos}</span>
              <span>20 mecânicos</span>
            </div>
          </div>

          {/* Slider 3: Faturamento de Serviços */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#173042]">Faturamento de Serviços (Mão de Obra)</span>
              <span className="font-mono font-bold text-sm text-[#102B3F] bg-[#EAF3F8] px-2 py-0.5 rounded border border-[#9FC4D8]">
                {formatCurrency(simInputs.fatServicos)}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="200000"
              step="2000"
              value={simInputs.fatServicos}
              onChange={(e) => handleSliderChange('fatServicos', Number(e.target.value))}
              className="w-full h-2 bg-[#E9EEF1] rounded-lg appearance-none cursor-pointer accent-[#102B3F]"
            />
            <div className="flex justify-between text-[10px] text-[#6B7780]">
              <span>R$ 10.000</span>
              <span>Atual: {formatCurrency(currentInputs.fatServicos)}</span>
              <span>R$ 200.000</span>
            </div>
          </div>

          {/* Slider 4: Lucro Líquido Serviços */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#173042]">Lucro Líquido de Serviços</span>
              <span className="font-mono font-bold text-sm text-[#102B3F] bg-[#EAF3F8] px-2 py-0.5 rounded border border-[#9FC4D8]">
                {formatCurrency(simInputs.lucroLiqServicos)} ({formatPercent(simCalcs.margemRealServicos, 1)})
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.max(50000, simInputs.fatServicos * 0.5)}
              step="500"
              value={simInputs.lucroLiqServicos}
              onChange={(e) => handleSliderChange('lucroLiqServicos', Number(e.target.value))}
              className="w-full h-2 bg-[#E9EEF1] rounded-lg appearance-none cursor-pointer accent-[#102B3F]"
            />
            <div className="flex justify-between text-[10px] text-[#6B7780]">
              <span>R$ 0</span>
              <span>Meta: {formatPercent(simInputs.metaLucroServicos, 1)}</span>
              <span>{formatCurrency(simInputs.fatServicos * 0.5)}</span>
            </div>
          </div>

          {/* Slider 5: Lucro Bruto de Peças */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#173042]">Faturamento de Peças</span>
              <span className="font-mono font-bold text-sm text-[#102B3F] bg-[#EAF3F8] px-2 py-0.5 rounded border border-[#9FC4D8]">
                {formatCurrency(simInputs.fatPecas)} (Lucro Bruto: {formatCurrency(simCalcs.lucroBrutoPecas)})
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="1000"
              value={simInputs.fatPecas}
              onChange={(e) => handleSliderChange('fatPecas', Number(e.target.value))}
              className="w-full h-2 bg-[#E9EEF1] rounded-lg appearance-none cursor-pointer accent-[#102B3F]"
            />
            <div className="flex justify-between text-[10px] text-[#6B7780]">
              <span>R$ 5.000</span>
              <span>Meta Cob: {formatCurrency(simInputs.metaCobPecas)}</span>
              <span>R$ 100.000</span>
            </div>
          </div>

          {/* Slider 6: Retornos em Garantia */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#173042]">Retornos em Garantia (Retrabalho)</span>
              <span className="font-mono font-bold text-sm text-[#102B3F] bg-[#EAF3F8] px-2 py-0.5 rounded border border-[#9FC4D8]">
                {simInputs.retornosGarantia} veículos ({formatPercent(simCalcs.taxaRetrabalho, 2)})
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={simInputs.retornosGarantia}
              onChange={(e) => handleSliderChange('retornosGarantia', Number(e.target.value))}
              className="w-full h-2 bg-[#E9EEF1] rounded-lg appearance-none cursor-pointer accent-[#102B3F]"
            />
            <div className="flex justify-between text-[10px] text-[#6B7780]">
              <span>0 (Meta ideal)</span>
              <span>Atual: {currentInputs.retornosGarantia}</span>
              <span>10 veículos</span>
            </div>
          </div>
        </div>

        {/* Live Comparison Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Master Result Card */}
          <div className="bg-[#102B3F] text-white rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#9FC4D8]/20 pb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D9A62E]">
                COMPARAÇÃO: ATUAL VS. SIMULADO
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#183D52] font-semibold text-[#9FC4D8]">
                Impacto em Tempo Real
              </span>
            </div>

            {/* Q1 Comparison */}
            <div className="bg-[#183D52] p-3 rounded-lg border border-[#9FC4D8]/20 space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span>Q1 — Produtividade</span>
                <StatusBadge statusText={simCalcs.statusProdutividade} level={simCalcs.levelProdutividade} size="sm" />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#9FC4D8]">Atual: {formatPercent(currentCalcs.produtividadeReal, 1)}</span>
                <span className="text-white font-bold font-mono text-sm">
                  Simulado: {formatPercent(simCalcs.produtividadeReal, 1)}
                </span>
              </div>
            </div>

            {/* Q2 Comparison */}
            <div className="bg-[#183D52] p-3 rounded-lg border border-[#9FC4D8]/20 space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span>Q2 — CPH Real</span>
                <StatusBadge statusText={simCalcs.statusCph} level={simCalcs.levelCph} size="sm" />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#9FC4D8]">Atual: {formatCurrency(currentCalcs.cphReal)}/h ({formatPercent(currentCalcs.variacaoCph, 1)})</span>
                <span className="text-white font-bold font-mono text-sm">
                  Simulado: {formatCurrency(simCalcs.cphReal)}/h
                </span>
              </div>
            </div>

            {/* Q3 Comparison */}
            <div className="bg-[#183D52] p-3 rounded-lg border border-[#9FC4D8]/20 space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span>Q3 — Comercial</span>
                <StatusBadge statusText={simCalcs.statusComercial} level={simCalcs.levelComercial} size="sm" />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#9FC4D8]">Serviços: {simCalcs.servicosBateuMeta ? '✅' : '❌'}</span>
                <span className="text-[#9FC4D8]">Peças: {simCalcs.pecasBateuMeta ? '✅' : '❌'}</span>
              </div>
            </div>

            {/* Q4 Comparison */}
            <div className="bg-[#183D52] p-3 rounded-lg border border-[#9FC4D8]/20 space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span>Q4 — Qualidade</span>
                <StatusBadge statusText={simCalcs.statusQualidade} level={simCalcs.levelQualidade} size="sm" />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#9FC4D8]">Atual: {formatPercent(currentCalcs.taxaRetrabalho, 1)}</span>
                <span className="text-white font-bold font-mono text-sm">
                  Simulado: {formatPercent(simCalcs.taxaRetrabalho, 2)}
                </span>
              </div>
            </div>

            {/* Diagnostic Box */}
            <div
              className={`p-3 rounded-lg border text-xs font-bold ${
                simCalcs.isFullGreen
                  ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#2E7D32]/40'
                  : 'bg-[#FFF4D6] text-[#173042] border-[#B77900]/40'
              }`}
            >
              <span className="block text-[10px] text-[#6B7780] uppercase">Diagnóstico Simulado</span>
              {simCalcs.diagnosticoTexto}
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApply}
              className="w-full py-2.5 rounded-lg bg-[#D9A62E] hover:bg-[#e5b138] text-[#102B3F] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar e Aplicar Este Cenário</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
