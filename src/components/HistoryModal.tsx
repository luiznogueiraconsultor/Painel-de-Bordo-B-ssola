import React, { useState } from 'react';
import { DashboardInputs, SavedRecord } from '../types';
import { calculateDashboard, formatCurrency, formatPercent, formatNumber } from '../utils/calculations';
import { exportCockpitToExcel } from '../utils/excelExport';
import { StatusBadge } from './StatusBadge';
import {
  X,
  History,
  Trash2,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  PlusCircle,
  FileText
} from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedRecords: SavedRecord[];
  onLoadRecord: (record: SavedRecord) => void;
  onDeleteRecord: (id: string) => void;
  onSaveCurrent: (note?: string) => void;
  currentPeriod: string;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  savedRecords,
  onLoadRecord,
  onDeleteRecord,
  onSaveCurrent,
  currentPeriod,
}) => {
  const [newNote, setNewNote] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveCurrent(newNote);
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#D5DDE2] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#102B3F] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#D9A62E]">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-[#D9A62E]" />
            <div>
              <h3 className="text-base font-bold uppercase tracking-wider text-white">
                Histórico de Períodos & Snapshots
              </h3>
              <p className="text-[11px] text-[#9FC4D8]">
                Gerencie semanas e fechamentos salvos no seu painel de bordo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-[#183D52] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Save Current Box */}
          <div className="bg-[#EAF3F8] border border-[#9FC4D8] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#102B3F] block">
                Salvar Período Atual no Histórico:
              </span>
              <span className="text-xs text-[#6B7780] font-medium">
                {currentPeriod}
              </span>
              <div className="mt-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Observação opcional (ex: Fechamento oficial)"
                  className="text-xs bg-white border border-[#9FC4D8] rounded px-2.5 py-1 text-[#173042] w-full sm:w-72 focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#102B3F] text-[#D9A62E] hover:bg-[#183D52] rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer self-end sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Salvar Agora</span>
            </button>
          </div>

          {/* Records List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#102B3F] uppercase tracking-wider">
              Registros Gravados ({savedRecords.length})
            </h4>

            {savedRecords.length === 0 ? (
              <div className="text-center py-10 bg-[#FBF8F0] rounded-xl border border-[#D5DDE2]">
                <FileText className="w-8 h-8 text-[#6B7780] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-[#6B7780] font-medium">
                  Nenhum período salvo no histórico ainda.
                </p>
                <p className="text-[11px] text-[#6B7780]/80 mt-1">
                  Use o botão acima ou o botão "Salvar" no topo da tela para guardar snapshots semanais.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedRecords.map((rec) => {
                  const c = calculateDashboard(rec.inputs);
                  const dateStr = new Date(rec.timestamp).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={rec.id}
                      className="bg-white rounded-xl border border-[#D5DDE2] p-4 shadow-xs hover:border-[#102B3F]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#102B3F]">{rec.periodo}</span>
                          <span className="text-[10px] text-[#6B7780] bg-[#E9EEF1] px-2 py-0.5 rounded">
                            {dateStr}
                          </span>
                        </div>
                        {rec.notes && (
                          <p className="text-xs text-[#6B7780] italic">"{rec.notes}"</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <StatusBadge statusText={`Produtividade ${formatPercent(c.produtividadeReal, 1)}`} level={c.levelProdutividade} size="sm" />
                          <StatusBadge statusText={`CPH ${formatCurrency(c.cphReal)}`} level={c.levelCph} size="sm" />
                          <StatusBadge statusText={`Comercial`} level={c.levelComercial} size="sm" />
                          <StatusBadge statusText={`Retrabalho ${formatPercent(c.taxaRetrabalho, 1)}`} level={c.levelQualidade} size="sm" />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => exportCockpitToExcel(rec.inputs, c, `Painel_${rec.periodo.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`)}
                          className="p-2 rounded-lg border border-[#D5DDE2] text-[#6B7780] hover:text-[#102B3F] hover:bg-[#E9EEF1] transition-colors cursor-pointer"
                          title="Exportar este histórico para Excel (.xlsx)"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteRecord(rec.id)}
                          className="p-2 rounded-lg border border-[#D5DDE2] text-[#C62828] hover:bg-[#FDEAEA] transition-colors cursor-pointer"
                          title="Excluir este registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            onLoadRecord(rec);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#102B3F] text-[#D9A62E] hover:bg-[#183D52] text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Carregar</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FBF8F0] px-6 py-3 border-t border-[#D5DDE2] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#102B3F] text-white text-xs font-bold rounded-lg hover:bg-[#183D52] transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
