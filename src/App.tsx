import React, { useState, useEffect } from 'react';
import { DashboardInputs, SavedRecord } from './types';
import { DEFAULT_INPUTS, calculateDashboard } from './utils/calculations';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { DataEntryView } from './components/DataEntryView';
import { CalculationsView } from './components/CalculationsView';
import { SimulatorView } from './components/SimulatorView';
import { HistoryModal } from './components/HistoryModal';
import { ShareModal } from './components/ShareModal';
import { QuestionnaireModal } from './components/QuestionnaireModal';
import { Layers, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY_INPUTS = 'painel_gestor_cockpit_inputs';
const STORAGE_KEY_HISTORY = 'painel_gestor_cockpit_history';

export default function App() {
  const [inputs, setInputs] = useState<DashboardInputs>(() => {
    try {
      // 1. Check if there are inputs passed in the URL parameters (shared link)
      if (typeof window !== 'undefined' && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const encodedDados = params.get('dados');
        if (encodedDados) {
          const parsed = JSON.parse(decodeURIComponent(encodedDados));
          return parsed;
        }
      }

      // 2. Check localStorage
      const saved = localStorage.getItem(STORAGE_KEY_INPUTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved inputs', e);
    }
    return DEFAULT_INPUTS;
  });

  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved history', e);
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<'painel' | 'entrada' | 'calculos' | 'simulador'>('painel');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INPUTS, JSON.stringify(inputs));
    } catch (e) {
      console.error('Error saving inputs to localStorage', e);
    }
  }, [inputs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(savedRecords));
    } catch (e) {
      console.error('Error saving history to localStorage', e);
    }
  }, [savedRecords]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const calcs = calculateDashboard(inputs);

  const handleReset = () => {
    setInputs({ ...DEFAULT_INPUTS });
    showToast('Valores originais restaurados com sucesso.');
  };

  const handleSaveSnapshot = (customNote?: string) => {
    const newRecord: SavedRecord = {
      id: String(Date.now()),
      timestamp: Date.now(),
      periodo: inputs.periodo,
      inputs: { ...inputs },
      notes: customNote || undefined,
    };
    setSavedRecords((prev) => [newRecord, ...prev]);
    showToast(`Período "${inputs.periodo}" salvo no histórico!`);
  };

  const handleLoadRecord = (rec: SavedRecord) => {
    setInputs({ ...rec.inputs });
    showToast(`Período "${rec.periodo}" carregado com sucesso.`);
  };

  const handleDeleteRecord = (id: string) => {
    setSavedRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Registro removido do histórico.');
  };

  const handleApplySimulator = (newInputs: DashboardInputs) => {
    setInputs({ ...newInputs });
    setActiveTab('painel');
    showToast('Cenário simulado aplicado ao Painel de Bordo!');
  };

  return (
    <div className="min-h-screen bg-[#FBF8F0] text-[#173042] flex flex-col font-sans selection:bg-[#D9A62E] selection:text-[#102B3F]">
      {/* Executive Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        inputs={inputs}
        setInputs={setInputs}
        calcs={calcs}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onSaveSnapshot={() => handleSaveSnapshot()}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenQuestionnaire={() => setIsQuestionnaireOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Floating Notification Toast */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#102B3F] text-white px-4 py-2.5 rounded-xl border border-[#D9A62E] shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-5 text-xs font-bold">
            <Check className="w-4 h-4 text-[#D9A62E]" />
            <span>{notification}</span>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'painel' && (
          <DashboardView
            inputs={inputs}
            calcs={calcs}
            onNavigateToDataEntry={() => setActiveTab('entrada')}
            onNavigateToSimulator={() => setActiveTab('simulador')}
          />
        )}

        {activeTab === 'entrada' && (
          <DataEntryView
            inputs={inputs}
            setInputs={setInputs}
            calcs={calcs}
            onReset={handleReset}
          />
        )}

        {activeTab === 'calculos' && (
          <CalculationsView inputs={inputs} calcs={calcs} />
        )}

        {activeTab === 'simulador' && (
          <SimulatorView
            currentInputs={inputs}
            onApplyToMain={handleApplySimulator}
          />
        )}
      </main>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedRecords={savedRecords}
        onLoadRecord={handleLoadRecord}
        onDeleteRecord={handleDeleteRecord}
        onSaveCurrent={handleSaveSnapshot}
        currentPeriod={inputs.periodo}
      />

      {/* Share & Embed Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        inputs={inputs}
        calcs={calcs}
      />

      {/* Questionnaire / Roteiro PDF & Word Modal */}
      <QuestionnaireModal
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
      />

      {/* Professional Polish Footer */}
      <footer className="bg-[#102B3F] p-4 text-white flex flex-col sm:flex-row justify-between items-center shrink-0 border-t border-[#D9A62E] gap-3 mt-auto">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#2E7D32] shadow-[0_0_8px_rgba(46,125,50,0.6)]" />
            <span className="text-[10px] font-bold uppercase tracking-tight text-white">
              Dentro da Meta
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#B77900] shadow-[0_0_8px_rgba(183,121,0,0.6)]" />
            <span className="text-[10px] font-bold uppercase tracking-tight text-white">
              Atenção / Vigiar
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#C62828] shadow-[0_0_8px_rgba(198,40,40,0.6)]" />
            <span className="text-[10px] font-bold uppercase tracking-tight text-white">
              Alerta / Agir
            </span>
          </div>
        </div>
        <div className="text-[10px] text-gray-300 font-medium flex items-center gap-1.5">
          <span className="text-[#D9A62E] font-black tracking-wider uppercase">Bússola Gestão Automotiva</span>
          <span className="text-[#9FC4D8]">•</span>
          <span>Cockpit Master v2.0 • Metodologia 4 Quadrantes</span>
        </div>
      </footer>
    </div>
  );
}
