import React, { useState } from 'react';
import { DashboardInputs, DashboardCalculations } from '../types';
import { PRESETS } from '../utils/calculations';
import { exportCockpitToExcel } from '../utils/excelExport';
import { BussolaLogo } from './BussolaLogo';
import {
  Download,
  Copy,
  Check,
  Calendar,
  Layers,
  FileSpreadsheet,
  Calculator,
  Sliders,
  Sparkles,
  RotateCcw,
  BookmarkPlus,
  History,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Share2,
  ClipboardList
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeaderProps {
  activeTab: 'painel' | 'entrada' | 'calculos' | 'simulador';
  setActiveTab: (tab: 'painel' | 'entrada' | 'calculos' | 'simulador') => void;
  inputs: DashboardInputs;
  setInputs: React.Dispatch<React.SetStateAction<DashboardInputs>>;
  calcs: DashboardCalculations;
  onOpenHistory: () => void;
  onSaveSnapshot: () => void;
  onOpenShare: () => void;
  onOpenQuestionnaire: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  inputs,
  setInputs,
  calcs,
  onOpenHistory,
  onSaveSnapshot,
  onOpenShare,
  onOpenQuestionnaire,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditingPeriod, setIsEditingPeriod] = useState(false);
  const [tempPeriod, setTempPeriod] = useState(inputs.periodo);

  const handleCopySummary = () => {
    const text = `📊 *PAINEL DE BORDO DO GESTOR — COCKPIT*
🗓️ *Período:* ${inputs.periodo}
───────────────────────
🔹 *Q1 Produtividade Pátio:* ${((calcs.produtividadeReal || 0) * 100).toFixed(1)}% (${calcs.statusProdutividade})
   • Horas Disponíveis: ${calcs.horasDisponiveis.toFixed(1)} h | Faturadas: ${calcs.horasFaturadas.toFixed(1)} h

🔹 *Q2 CPH & Absorção:* Variação ${((calcs.variacaoCph || 0) * 100).toFixed(1)}% (${calcs.statusCph})
   • CPH Ideal: R$ ${calcs.cphIdeal.toFixed(2)}/h | CPH Real: R$ ${calcs.cphReal.toFixed(2)}/h

🔹 *Q3 Comercial por Motor:* ${calcs.statusComercial}
   • Serviços: Margem Real ${((calcs.margemRealServicos || 0) * 100).toFixed(1)}% (Meta: ${((inputs.metaLucroServicos || 0) * 100).toFixed(1)}% - ${calcs.servicosBateuMeta ? 'SIM' : 'NÃO'})
   • Peças: Lucro Bruto R$ ${calcs.lucroBrutoPecas.toFixed(2)} (Meta: R$ ${inputs.metaCobPecas.toFixed(2)} - ${calcs.pecasBateuMeta ? 'SIM' : 'NÃO'})

🔹 *Q4 Refugo & Qualidade:* Retrabalho ${((calcs.taxaRetrabalho || 0) * 100).toFixed(1)}% (${calcs.statusQualidade})
   • O.S. Faturadas: ${inputs.osFaturadas} | Retornos Garantia: ${inputs.retornosGarantia}
───────────────────────
📌 *DIAGNÓSTICO:* ${calcs.diagnosticoTexto}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportExcel = () => {
    exportCockpitToExcel(inputs, calcs);
  };

  const handleApplyPreset = (presetName: string) => {
    const found = PRESETS.find((p) => p.name === presetName);
    if (found) {
      setInputs({ ...found.data });
      if (presetName.includes('Alta Performance')) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const savePeriod = () => {
    if (tempPeriod.trim()) {
      setInputs((prev) => ({ ...prev, periodo: tempPeriod.trim() }));
    }
    setIsEditingPeriod(false);
  };

  return (
    <header className="bg-[#102B3F] text-white border-b-4 border-[#D9A62E] shadow-md sticky top-0 z-30">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Title matching Professional Polish */}
          <div className="flex items-center gap-4">
            <BussolaLogo size="md" showSubtitle={false} allowCustomUpload={true} />
            <div className="border-l border-[#9FC4D8]/30 pl-4">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase font-sans leading-tight">
                Painel de Bordo do Gestor
              </h1>
              <p className="text-[#D9A62E] text-[11px] sm:text-xs font-semibold tracking-widest uppercase">
                COCKPIT OPERACIONAL — V2.0
              </p>
            </div>
          </div>

          {/* Quick Actions & Period */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Period Indicator */}
            <div className="bg-[#183D52] border border-[#9FC4D8]/30 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
              <Calendar className="w-4 h-4 text-[#D9A62E] shrink-0" />
              {isEditingPeriod ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempPeriod}
                    onChange={(e) => setTempPeriod(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && savePeriod()}
                    className="bg-[#102B3F] text-white text-xs px-2 py-0.5 rounded border border-[#9FC4D8] focus:outline-none font-bold"
                    autoFocus
                  />
                  <button
                    onClick={savePeriod}
                    className="text-[#D9A62E] hover:text-white font-bold text-xs px-1"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setTempPeriod(inputs.periodo);
                    setIsEditingPeriod(true);
                  }}
                  className="text-white hover:text-[#D9A62E] transition-colors text-left truncate max-w-[220px]"
                  title="Clique para editar o período"
                >
                  <p className="text-[9px] text-[#9FC4D8] opacity-75 uppercase tracking-wider font-bold">
                    Período de Análise
                  </p>
                  <p className="text-xs font-bold leading-tight truncate">
                    {inputs.periodo}
                  </p>
                </button>
              )}
            </div>

            {/* Presets dropdown */}
            <div className="relative group">
              <button
                className="bg-[#183D52] hover:bg-[#1f4e68] border border-[#9FC4D8]/30 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Carregar cenários pré-configurados"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D9A62E]" />
                <span className="hidden sm:inline">Cenários</span>
              </button>
              <div className="absolute right-0 mt-1 w-64 bg-[#183D52] border border-[#9FC4D8]/40 rounded-lg shadow-xl py-1 hidden group-hover:block z-50">
                <div className="px-3 py-1 text-[10px] font-bold text-[#9FC4D8] uppercase border-b border-[#9FC4D8]/20">
                  Carregar Modelo
                </div>
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => handleApplyPreset(p.name)}
                    className="w-full text-left px-3 py-2 text-xs text-white hover:bg-[#102B3F] transition-colors flex flex-col cursor-pointer"
                  >
                    <span className="font-semibold text-[#D9A62E]">{p.name}</span>
                    <span className="text-[10px] text-[#9FC4D8] line-clamp-1">{p.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Save snapshot */}
            <button
              onClick={onSaveSnapshot}
              className="bg-[#183D52] hover:bg-[#1f4e68] border border-[#9FC4D8]/30 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Salvar registro histórico deste período"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-[#9FC4D8]" />
              <span className="hidden md:inline">Salvar</span>
            </button>

            {/* History Button */}
            <button
              onClick={onOpenHistory}
              className="bg-[#183D52] hover:bg-[#1f4e68] border border-[#9FC4D8]/30 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Histórico de períodos salvos"
            >
              <History className="w-3.5 h-3.5 text-[#9FC4D8]" />
              <span className="hidden md:inline">Histórico</span>
            </button>

            {/* Copy Summary */}
            <button
              onClick={handleCopySummary}
              className="bg-[#183D52] hover:bg-[#1f4e68] border border-[#9FC4D8]/30 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copiar resumo executivo para WhatsApp/Email"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span className="text-[#2E7D32]">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#D9A62E]" />
                  <span className="hidden sm:inline">Copiar</span>
                </>
              )}
            </button>

            {/* Questionnaire / Roteiro PDF & Word Button */}
            <button
              onClick={onOpenQuestionnaire}
              className="bg-[#183D52] hover:bg-[#1f4e68] border border-[#9FC4D8]/40 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Baixar Roteiro de Perguntas em PDF ou Word (.docx)"
            >
              <ClipboardList className="w-3.5 h-3.5 text-[#D9A62E]" />
              <span className="hidden sm:inline">Roteiro (PDF/Word)</span>
            </button>

            {/* Share / Embed Button */}
            <button
              onClick={onOpenShare}
              className="bg-[#183D52] hover:bg-[#1f4e68] border border-[#D9A62E]/60 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Compartilhar link (WhatsApp, E-mail, Instagram, Facebook) ou código HTML/Embed"
            >
              <Share2 className="w-3.5 h-3.5 text-[#D9A62E]" />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>

            {/* Export Excel (.xlsx) */}
            <button
              onClick={handleExportExcel}
              className="bg-gradient-to-r from-[#D9A62E] to-[#c29121] hover:from-[#e5b138] hover:to-[#d09d29] text-[#102B3F] px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              title="Baixar arquivo Excel (.xlsx)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#183D52] px-4 sm:px-6 lg:px-8 border-t border-[#102B3F]">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-1.5">
          <button
            onClick={() => setActiveTab('painel')}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'painel'
                ? 'bg-[#102B3F] text-[#D9A62E] shadow-sm border-b-2 border-[#D9A62E]'
                : 'text-white/80 hover:text-white hover:bg-[#102B3F]/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Painel de Bordo (Cockpit)</span>
          </button>

          <button
            onClick={() => setActiveTab('entrada')}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'entrada'
                ? 'bg-[#102B3F] text-[#D9A62E] shadow-sm border-b-2 border-[#D9A62E]'
                : 'text-white/80 hover:text-white hover:bg-[#102B3F]/50'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Entrada de Dados</span>
          </button>

          <button
            onClick={() => setActiveTab('calculos')}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'calculos'
                ? 'bg-[#102B3F] text-[#D9A62E] shadow-sm border-b-2 border-[#D9A62E]'
                : 'text-white/80 hover:text-white hover:bg-[#102B3F]/50'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Memória de Cálculos</span>
          </button>

          <button
            onClick={() => setActiveTab('simulador')}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'simulador'
                ? 'bg-[#102B3F] text-[#D9A62E] shadow-sm border-b-2 border-[#D9A62E]'
                : 'text-white/80 hover:text-white hover:bg-[#102B3F]/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Simulador & Metas</span>
          </button>
        </div>
      </div>
    </header>
  );
};
