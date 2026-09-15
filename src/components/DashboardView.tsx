import React from 'react';
import { DashboardInputs, DashboardCalculations } from '../types';
import { StatusBadge } from './StatusBadge';
import { GaugeMeter } from './GaugeMeter';
import { formatCurrency, formatPercent, formatNumber } from '../utils/calculations';
import {
  Wrench,
  DollarSign,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Package,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Sliders,
  FileSpreadsheet
} from 'lucide-react';

interface DashboardViewProps {
  inputs: DashboardInputs;
  calcs: DashboardCalculations;
  onNavigateToDataEntry: () => void;
  onNavigateToSimulator: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  inputs,
  calcs,
  onNavigateToDataEntry,
  onNavigateToSimulator,
}) => {
  // Helpers for KPI border color
  const getBorderColor = (level: 'green' | 'yellow' | 'red') => {
    switch (level) {
      case 'green':
        return 'border-[#2E7D32]';
      case 'yellow':
        return 'border-[#B77900]';
      case 'red':
      default:
        return 'border-[#C62828]';
    }
  };

  const getTextColor = (level: 'green' | 'yellow' | 'red') => {
    switch (level) {
      case 'green':
        return 'text-[#2E7D32]';
      case 'yellow':
        return 'text-[#B77900]';
      case 'red':
      default:
        return 'text-[#C62828]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Summary Bar matching Professional Polish */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 sm:px-8 py-4 bg-white border-b border-[#E9EEF1] rounded-xl shadow-xs shrink-0">
        {/* KPI 1: Produtividade */}
        <div className={`border-l-4 ${getBorderColor(calcs.levelProdutividade)} pl-3 py-1 flex flex-col justify-between`}>
          <p className="text-[10px] text-[#6B7780] font-bold uppercase tracking-wider">
            Produtividade
          </p>
          <p className="text-xl sm:text-2xl font-black text-[#102B3F] tracking-tight">
            {formatPercent(calcs.produtividadeReal, 1)}{' '}
            <span className={`text-xs font-semibold ${getTextColor(calcs.levelProdutividade)} italic uppercase`}>
              — {calcs.statusProdutividade.split(' — ')[0]}
            </span>
          </p>
        </div>

        {/* KPI 2: CPH Real */}
        <div className={`border-l-4 ${getBorderColor(calcs.levelCph)} pl-3 py-1 flex flex-col justify-between`}>
          <p className="text-[10px] text-[#6B7780] font-bold uppercase tracking-wider">
            CPH Real
          </p>
          <p className="text-xl sm:text-2xl font-black text-[#102B3F] tracking-tight">
            {formatCurrency(calcs.cphReal)}{' '}
            <span className={`text-xs font-semibold ${getTextColor(calcs.levelCph)} italic uppercase`}>
              — {calcs.statusCph.split(' — ')[0]}
            </span>
          </p>
        </div>

        {/* KPI 3: Meta Comercial */}
        <div className={`border-l-4 ${getBorderColor(calcs.levelComercial)} pl-3 py-1 flex flex-col justify-between`}>
          <p className="text-[10px] text-[#6B7780] font-bold uppercase tracking-wider">
            Meta Comercial
          </p>
          <p className="text-xl sm:text-2xl font-black text-[#102B3F] tracking-tight">
            {calcs.servicosBateuMeta && calcs.pecasBateuMeta ? '100%' : calcs.servicosBateuMeta || calcs.pecasBateuMeta ? '50%' : '0%'}{' '}
            <span className={`text-xs font-semibold ${getTextColor(calcs.levelComercial)} italic uppercase`}>
              — {calcs.statusComercial.split(' — ')[0]}
            </span>
          </p>
        </div>

        {/* KPI 4: Qualidade */}
        <div className={`border-l-4 ${getBorderColor(calcs.levelQualidade)} pl-3 py-1 flex flex-col justify-between`}>
          <p className="text-[10px] text-[#6B7780] font-bold uppercase tracking-wider">
            Qualidade
          </p>
          <p className="text-xl sm:text-2xl font-black text-[#102B3F] tracking-tight">
            {formatPercent(calcs.taxaRetrabalho, 1)}{' '}
            <span className={`text-xs font-semibold ${getTextColor(calcs.levelQualidade)} italic uppercase`}>
              — {calcs.statusQualidade.split(' — ')[0]}
            </span>
          </p>
        </div>
      </div>

      {/* Main Content Grid: Top Row of 3 Quadrants */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Q1: Produtividade Real */}
        <section className="bg-white rounded-lg shadow-sm border border-[#D5DDE2] flex flex-col overflow-hidden">
          <div className="bg-[#183D52] px-4 py-2.5 text-white font-bold text-xs uppercase tracking-wide flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#D9A62E]" />
              <span>Q1 — Produtividade Real (Pátio)</span>
            </div>
            <span className="text-[#D9A62E] font-bold">
              STATUS: {calcs.statusProdutividade.split(' — ')[0]}
            </span>
          </div>

          <div className="p-4 flex flex-col justify-between flex-grow space-y-4">
            <table className="w-full text-xs">
              <tbody>
                <tr className="border-b border-[#E9EEF1] h-8">
                  <td className="font-medium text-[#173042]">Horas disponíveis (capacidade)</td>
                  <td className="text-right font-bold text-[#102B3F]">
                    {formatNumber(calcs.horasDisponiveis, 1)} h
                  </td>
                </tr>
                <tr className="border-b border-[#E9EEF1] h-8">
                  <td className="font-medium text-[#173042]">Horas faturadas no período</td>
                  <td className="text-right font-bold text-[#102B3F]">
                    {formatNumber(calcs.horasFaturadas, 1)} h
                  </td>
                </tr>
                <tr className="h-8">
                  <td className="font-medium text-[#173042]">Meta de Vigília</td>
                  <td className="text-right text-[11px] italic text-[#6B7780]">
                    Ouro ≥ 85% · Prata 70–84%
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Gauge */}
            <div className="py-1">
              <GaugeMeter
                value={calcs.produtividadeReal}
                type="productivity"
                level={calcs.levelProdutividade}
              />
            </div>

            {/* Highlighted Result Container */}
            <div
              className={`mt-2 p-3 rounded border ${
                calcs.levelProdutividade === 'green'
                  ? 'bg-[#E8F5E9] border-[#2E7D32]'
                  : calcs.levelProdutividade === 'yellow'
                  ? 'bg-[#FFF4D6] border-[#D9A62E]'
                  : 'bg-[#FDEAEA] border-[#C62828]'
              }`}
            >
              <div className="flex justify-between items-end">
                <span
                  className={`text-[10px] font-bold uppercase ${
                    calcs.levelProdutividade === 'green'
                      ? 'text-[#2E7D32]'
                      : calcs.levelProdutividade === 'yellow'
                      ? 'text-[#B77900]'
                      : 'text-[#C62828]'
                  }`}
                >
                  PRODUTIVIDADE REAL
                </span>
                <span
                  className={`text-2xl font-black ${
                    calcs.levelProdutividade === 'green'
                      ? 'text-[#2E7D32]'
                      : calcs.levelProdutividade === 'yellow'
                      ? 'text-[#B77900]'
                      : 'text-[#C62828]'
                  }`}
                >
                  {formatPercent(calcs.produtividadeReal, 1)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Q2: CPH e Absorção */}
        <section className="bg-white rounded-lg shadow-sm border border-[#D5DDE2] flex flex-col overflow-hidden">
          <div className="bg-[#183D52] px-4 py-2.5 text-white font-bold text-xs uppercase tracking-wide flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#D9A62E]" />
              <span>Q2 — CPH e Absorção (Finanças)</span>
            </div>
            <span className="text-[#D9A62E] font-bold">
              STATUS: {calcs.statusCph.split(' — ')[0]}
            </span>
          </div>

          <div className="p-4 flex flex-col justify-between flex-grow space-y-4">
            <table className="w-full text-xs">
              <tbody>
                <tr className="border-b border-[#E9EEF1] h-8">
                  <td className="font-medium text-[#173042]">CPH Ideal (CFR / Cap.)</td>
                  <td className="text-right font-bold text-[#102B3F]">
                    {formatCurrency(calcs.cphIdeal)}/h
                  </td>
                </tr>
                <tr className="border-b border-[#E9EEF1] h-8">
                  <td className="font-medium text-[#173042]">CPH Real (CFR / Fatur.)</td>
                  <td className="text-right font-bold text-[#102B3F]">
                    {formatCurrency(calcs.cphReal)}/h
                  </td>
                </tr>
                <tr className="h-8">
                  <td className="font-medium text-[#173042]">Variação Real vs. Ideal</td>
                  <td
                    className={`text-right font-bold ${
                      calcs.levelCph === 'green'
                        ? 'text-[#2E7D32]'
                        : calcs.levelCph === 'yellow'
                        ? 'text-[#B77900]'
                        : 'text-[#C62828]'
                    }`}
                  >
                    {calcs.variacaoCph > 0 ? `+${formatPercent(calcs.variacaoCph, 1)}` : formatPercent(calcs.variacaoCph, 1)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Gauge */}
            <div className="py-1">
              <GaugeMeter
                value={Math.max(calcs.variacaoCph, 0)}
                type="cph"
                level={calcs.levelCph}
              />
            </div>

            {/* Highlighted Result Container */}
            <div
              className={`mt-2 p-3 rounded border ${
                calcs.levelCph === 'green'
                  ? 'bg-[#E8F5E9] border-[#2E7D32]'
                  : calcs.levelCph === 'yellow'
                  ? 'bg-[#FFF4D6] border-[#D9A62E]'
                  : 'bg-[#FDEAEA] border-[#C62828]'
              }`}
            >
              <div className="flex justify-between items-end">
                <span
                  className={`text-[10px] font-bold uppercase ${
                    calcs.levelCph === 'green'
                      ? 'text-[#2E7D32]'
                      : calcs.levelCph === 'yellow'
                      ? 'text-[#B77900]'
                      : 'text-[#C62828]'
                  }`}
                >
                  VARIAÇÃO CPH
                </span>
                <span
                  className={`text-2xl font-black ${
                    calcs.levelCph === 'green'
                      ? 'text-[#2E7D32]'
                      : calcs.levelCph === 'yellow'
                      ? 'text-[#B77900]'
                      : 'text-[#C62828]'
                  }`}
                >
                  {calcs.levelCph === 'green' ? 'SAUDÁVEL' : calcs.levelCph === 'yellow' ? 'ATENÇÃO' : 'ALERTA'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Q3: Margem por Motor (Comercial) */}
        <section className="bg-white rounded-lg shadow-sm border border-[#D5DDE2] flex flex-col overflow-hidden">
          <div className="bg-[#183D52] px-4 py-2.5 text-white font-bold text-xs uppercase tracking-wide flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#D9A62E]" />
              <span>Q3 — Margem por Motor (Comercial)</span>
            </div>
            <span className="text-[#D9A62E] font-bold">
              STATUS: {calcs.statusComercial.split(' — ')[0]}
            </span>
          </div>

          <div className="p-4 flex flex-col justify-between flex-grow space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FBF8F0] p-2.5 rounded-lg border border-[#D5DDE2]/60">
                <p className="text-[10px] font-bold uppercase text-[#6B7780]">Motor Serviços</p>
                <p className="text-lg font-black text-[#102B3F]">
                  {formatPercent(calcs.margemRealServicos, 1)}{' '}
                  <span className="text-[10px] font-medium text-[#6B7780] block">
                    META: {formatPercent(inputs.metaLucroServicos, 1)}
                  </span>
                </p>
              </div>
              <div className="bg-[#FBF8F0] p-2.5 rounded-lg border border-[#D5DDE2]/60">
                <p className="text-[10px] font-bold uppercase text-[#6B7780]">Motor Peças</p>
                <p className="text-lg font-black text-[#102B3F]">
                  {formatCurrency(calcs.lucroBrutoPecas)}{' '}
                  <span className="text-[10px] font-medium text-[#6B7780] block">
                    META: {formatCurrency(inputs.metaCobPecas)}
                  </span>
                </p>
              </div>
            </div>

            <table className="w-full text-xs">
              <tbody>
                <tr className="border-b border-[#E9EEF1] h-7">
                  <td className="font-medium text-[#173042]">Serviços bateu meta?</td>
                  <td className={`text-right font-bold ${calcs.servicosBateuMeta ? 'text-[#2E7D32]' : 'text-[#C62828]'}`}>
                    {calcs.servicosBateuMeta ? 'SIM (Margem ≥ Meta)' : 'NÃO (Abaixo)'}
                  </td>
                </tr>
                <tr className="h-7">
                  <td className="font-medium text-[#173042]">Peças bateu cobertura?</td>
                  <td className={`text-right font-bold ${calcs.pecasBateuMeta ? 'text-[#2E7D32]' : 'text-[#C62828]'}`}>
                    {calcs.pecasBateuMeta ? 'SIM (Lucro ≥ Meta)' : 'NÃO (Abaixo)'}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Highlighted Result Container */}
            <div
              className={`mt-2 p-3 rounded border text-center ${
                calcs.levelComercial === 'green'
                  ? 'bg-[#E8F5E9] border-[#2E7D32]'
                  : calcs.levelComercial === 'yellow'
                  ? 'bg-[#FFF4D6] border-[#D9A62E]'
                  : 'bg-[#FDEAEA] border-[#C62828]'
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase block ${
                  calcs.levelComercial === 'green'
                    ? 'text-[#2E7D32]'
                    : calcs.levelComercial === 'yellow'
                    ? 'text-[#B77900]'
                    : 'text-[#C62828]'
                }`}
              >
                {calcs.servicosBateuMeta && calcs.pecasBateuMeta
                  ? 'AMBOS OS MOTORES ATINGIRAM AS METAS'
                  : calcs.servicosBateuMeta || calcs.pecasBateuMeta
                  ? 'UM MOTOR ATINGIU A META DEFINIDA'
                  : 'NENHUM MOTOR ATINGIU A META ESPERADA'}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Second Row: Q4 & Diagnóstico Rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Q4: Qualidade (Retrabalho) */}
        <section className="bg-white rounded-lg shadow-sm border border-[#D5DDE2] flex flex-col overflow-hidden">
          <div className="bg-[#183D52] px-4 py-2.5 text-white font-bold text-xs uppercase tracking-wide flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#D9A62E]" />
              <span>Q4 — Qualidade (Retrabalho)</span>
            </div>
            <span className="text-[#D9A62E] font-bold">
              STATUS: {calcs.statusQualidade.split(' — ')[0]}
            </span>
          </div>

          <div className="p-4 flex flex-col justify-between flex-grow space-y-4">
            <table className="w-full text-xs">
              <tbody>
                <tr className="border-b border-[#E9EEF1] h-8">
                  <td className="font-medium text-[#173042]">O.S. faturadas no período</td>
                  <td className="text-right font-bold text-[#102B3F]">
                    {inputs.osFaturadas}
                  </td>
                </tr>
                <tr className="border-b border-[#E9EEF1] h-8">
                  <td className="font-medium text-[#173042]">Retornos em garantia</td>
                  <td className="text-right font-bold text-[#C62828]">
                    {inputs.retornosGarantia}
                  </td>
                </tr>
                <tr className="h-8">
                  <td className="font-medium text-[#173042]">% Retrabalho</td>
                  <td
                    className={`text-right font-black text-base ${
                      calcs.levelQualidade === 'green'
                        ? 'text-[#2E7D32]'
                        : calcs.levelQualidade === 'yellow'
                        ? 'text-[#B77900]'
                        : 'text-[#C62828]'
                    }`}
                  >
                    {formatPercent(calcs.taxaRetrabalho, 2)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Highlighted Result Container with progress bar */}
            <div
              className={`mt-2 p-3 rounded border ${
                calcs.levelQualidade === 'green'
                  ? 'bg-[#E8F5E9] border-[#2E7D32]'
                  : calcs.levelQualidade === 'yellow'
                  ? 'bg-[#FFF4D6] border-[#D9A62E]'
                  : 'bg-[#FDEAEA] border-[#C62828]'
              }`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-[10px] font-bold uppercase ${
                    calcs.levelQualidade === 'green'
                      ? 'text-[#2E7D32]'
                      : calcs.levelQualidade === 'yellow'
                      ? 'text-[#B77900]'
                      : 'text-[#C62828]'
                  }`}
                >
                  Meta de Vigília (Máx 1%)
                </span>
                <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      calcs.levelQualidade === 'green'
                        ? 'bg-[#2E7D32]'
                        : calcs.levelQualidade === 'yellow'
                        ? 'bg-[#B77900]'
                        : 'bg-[#C62828]'
                    }`}
                    style={{ width: `${Math.min(100, (calcs.taxaRetrabalho / 0.02) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DIAGNÓSTICO RÁPIDO DO GESTOR (Spans 2 columns on lg screens) */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#D5DDE2] flex flex-col overflow-hidden">
          <div className="bg-[#183D52] px-4 py-2.5 text-white font-bold text-xs uppercase tracking-wide flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#D9A62E]" />
              <span>Diagnóstico Rápido & Plano de Ação do Gestor</span>
            </div>
            <span className="text-[10px] text-[#9FC4D8] font-bold tracking-wider">
              ANÁLISE INTEGRADA
            </span>
          </div>

          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
            {/* Master Diagnostic Banner */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                calcs.isFullGreen
                  ? 'bg-[#E8F5E9] border-[#2E7D32]/40 text-[#2E7D32]'
                  : 'bg-[#FFF4D6] border-[#B77900]/40 text-[#173042]'
              }`}
            >
              {calcs.isFullGreen ? (
                <CheckCircle2 className="w-6 h-6 text-[#2E7D32] shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-[#B77900] shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-black text-sm sm:text-base uppercase tracking-wide">
                  {calcs.diagnosticoTexto}
                </div>
                <p className="text-xs text-[#173042]/90 leading-relaxed">
                  {calcs.isFullGreen
                    ? 'Parabéns! Todos os 4 quadrantes estão dentro das metas de vigília da metodologia. A oficina opera com produtividade ouro, CPH blindado, motores comerciais atingidos e excelente qualidade técnica.'
                    : `Identificamos desvios em ${calcs.diagnosticoDetalhes.length} quadrante(s). Veja abaixo os pontos de atenção imediatos e as ações táticas para reverter o cenário.`}
                </p>
              </div>
            </div>

            {/* Tactical Recommendations / Action Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Q1 Advice */}
              <div className={`p-3 rounded-lg border ${calcs.levelProdutividade === 'green' ? 'bg-[#E8F5E9]/50 border-[#2E7D32]/30' : 'bg-[#FBF8F0] border-[#D5DDE2]'}`}>
                <div className="font-bold flex items-center justify-between text-[#102B3F] mb-1">
                  <span>1. Ação no Pátio (Q1)</span>
                  <StatusBadge statusText={calcs.levelProdutividade.toUpperCase()} level={calcs.levelProdutividade} size="sm" />
                </div>
                <p className="text-[11px] text-[#6B7780] leading-relaxed">
                  {calcs.levelProdutividade === 'green'
                    ? 'Manter ritmo de faturamento e agendamento contínuo.'
                    : `Faltam ${Math.max(0, Math.round(calcs.horasDisponiveis * 0.85 - calcs.horasFaturadas))}h faturadas para atingir o nível OURO (85%). Realocar mecânicos e agilizar liberações.`}
                </p>
              </div>

              {/* Q2 Advice */}
              <div className={`p-3 rounded-lg border ${calcs.levelCph === 'green' ? 'bg-[#E8F5E9]/50 border-[#2E7D32]/30' : 'bg-[#FBF8F0] border-[#D5DDE2]'}`}>
                <div className="font-bold flex items-center justify-between text-[#102B3F] mb-1">
                  <span>2. Ação no CPH (Q2)</span>
                  <StatusBadge statusText={calcs.levelCph.toUpperCase()} level={calcs.levelCph} size="sm" />
                </div>
                <p className="text-[11px] text-[#6B7780] leading-relaxed">
                  {calcs.levelCph === 'green'
                    ? 'Absorção de estrutura está blindada (CPH Real próximo do Ideal).'
                    : `CPH Real está ${formatPercent(calcs.variacaoCph, 1)} acima do Ideal. Diluir o CFR de ${formatCurrency(inputs.cfrServicos)} aumentando a venda de horas no pátio.`}
                </p>
              </div>

              {/* Q3 Advice */}
              <div className={`p-3 rounded-lg border ${calcs.levelComercial === 'green' ? 'bg-[#E8F5E9]/50 border-[#2E7D32]/30' : 'bg-[#FBF8F0] border-[#D5DDE2]'}`}>
                <div className="font-bold flex items-center justify-between text-[#102B3F] mb-1">
                  <span>3. Ação Comercial (Q3)</span>
                  <StatusBadge statusText={calcs.levelComercial.toUpperCase()} level={calcs.levelComercial} size="sm" />
                </div>
                <p className="text-[11px] text-[#6B7780] leading-relaxed">
                  {!calcs.servicosBateuMeta && !calcs.pecasBateuMeta
                    ? 'Rever precificação de mão de obra e markup de autopeças.'
                    : !calcs.servicosBateuMeta
                    ? 'Treinar consultores técnicos na venda de pacotes de serviços preventivos.'
                    : !calcs.pecasBateuMeta
                    ? `Falta ${formatCurrency(Math.max(0, inputs.metaCobPecas - calcs.lucroBrutoPecas))} de margem bruta em peças para cobrir a meta.`
                    : 'Ambos os motores sustentando o faturamento e a lucratividade.'}
                </p>
              </div>

              {/* Q4 Advice */}
              <div className={`p-3 rounded-lg border ${calcs.levelQualidade === 'green' ? 'bg-[#E8F5E9]/50 border-[#2E7D32]/30' : 'bg-[#FBF8F0] border-[#D5DDE2]'}`}>
                <div className="font-bold flex items-center justify-between text-[#102B3F] mb-1">
                  <span>4. Ação na Qualidade (Q4)</span>
                  <StatusBadge statusText={calcs.levelQualidade.toUpperCase()} level={calcs.levelQualidade} size="sm" />
                </div>
                <p className="text-[11px] text-[#6B7780] leading-relaxed">
                  {calcs.levelQualidade === 'green'
                    ? 'Índice de refugo sob controle (<1%). Manter checklist e teste de rodagem.'
                    : `${inputs.retornosGarantia} retorno(s) em garantia identificados. Aplicar auditoria de processo de liberação e teste de rodagem pré-entrega.`}
                </p>
              </div>
            </div>

            {/* Fast Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#D5DDE2]">
              <button
                onClick={onNavigateToDataEntry}
                className="px-3 py-1.5 rounded-lg border border-[#102B3F] text-[#102B3F] hover:bg-[#102B3F] hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Editar Dados do Período</span>
              </button>
              <button
                onClick={onNavigateToSimulator}
                className="px-3 py-1.5 rounded-lg bg-[#102B3F] text-[#D9A62E] hover:bg-[#183D52] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Abrir Simulador de Metas</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
