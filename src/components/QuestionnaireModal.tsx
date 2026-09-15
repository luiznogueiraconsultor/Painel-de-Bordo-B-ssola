import React, { useState } from 'react';
import {
  FileText,
  Download,
  Check,
  Copy,
  FileSpreadsheet,
  Layers,
  HelpCircle,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { generateQuestionnairePDF, generateQuestionnaireWord } from '../utils/documentExport';

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [generatingWord, setGeneratingWord] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const rawQuestionsText = `ROTEIRO DE COLETA DE DADOS & DIAGNÓSTICO (MÉTODO BÚSSOLA GESTÃO AUTOMOTIVA)

📌 BLOCO 0: IDENTIFICAÇÃO E PERÍODO
0. Qual é o período de fechamento avaliado nestes números? (Ex: Mês de Julho/2026 ou Semana 12 a 18/08/2026)
   • Finalidade: Garante sincronia temporal de horas, faturamento e custos.

🔵 QUADRANTE 1: TERMÔMETRO DA PRODUTIVIDADE REAL (O PÁTIO)
1. Quantos mecânicos trabalharam diretamente executando serviços no pátio durante o período?
   • Finalidade: Define a base produtiva de mão de obra (não incluir recepção/consultores).
2. Qual a carga horária contratual mensal padrão de cada mecânico? (Padrão: 176 h/mês)
   • Finalidade: Multiplicada pelos mecânicos, define a Capacidade Instalada de Horas Disponíveis.
3. Qual foi o somatório total de horas de mão de obra faturadas nas O.S. no período?
   • Finalidade: Mede a Produtividade Real (Faturadas ÷ Disponíveis). Meta Ouro: >= 85%.

🟠 QUADRANTE 2: CPH REAL E ABSORÇÃO DE ESTRUTURA (FINANÇAS)
4. Qual foi o Custo Fixo de Responsabilidade (CFR) do Motor de Serviços no período? (R$)
   • Finalidade: Permite calcular o CPH Ideal vs. CPH Real e identificar desvios de absorção fixa.

🟢 QUADRANTE 3: MARGEM DE CONTRIBUIÇÃO POR MOTOR (COMERCIAL)
5. Qual foi o Faturamento Bruto total obtido com mão de obra/serviços no período? (R$)
   • Finalidade: Base para apuração da margem líquida de serviços.
6. Após deduzir custos diretos, impostos e CFR, quanto sobrou de Lucro Líquido em serviços? (R$)
   • Finalidade: Calcula a Margem Real de Serviços (Lucro Líquido ÷ Faturamento de Serviços).
7. Qual é a Meta de Margem de Lucro percentual estabelecida para serviços no seu VHT? (Ex: 18%)
   • Finalidade: Compara a entrega real com o planejado no VHT.
8. Qual foi o Faturamento Bruto total obtido com a venda de Peças no período? (R$)
   • Finalidade: Volume financeiro bruto do segundo motor da oficina.
9. Qual foi o Custo de Aquisição (CMV) + Impostos das Peças vendidas no período? (R$)
   • Finalidade: Apura o Lucro Bruto / Margem de Contribuição de Peças.
10. Qual é a Meta de Cobertura do Motor de Peças no período? (R$)
    • Finalidade: Avalia se o setor de peças é autossustentável e cobre seus custos fixos.

🔴 QUADRANTE 4: ÍNDICE DE REFUGO OPERACIONAL (QUALIDADE)
11. Quantas Ordens de Serviço (O.S.) foram finalizadas e entregues no período?
    • Finalidade: Amostra total de passagens no pátio.
12. Quantos carros retornaram à oficina no período com problemas de garantia/retrabalho?
    • Finalidade: Mede a Taxa de Retrabalho (Retornos ÷ O.S.). Teto de tolerância: 1%.`;

  const handleDownloadPDF = () => {
    setGeneratingPdf(true);
    try {
      generateQuestionnairePDF();
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setGeneratingPdf(false), 800);
    }
  };

  const handleDownloadWord = async () => {
    setGeneratingWord(true);
    try {
      await generateQuestionnaireWord();
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setGeneratingWord(false), 800);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(rawQuestionsText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#D5DDE2] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#102B3F] px-6 py-4 border-b-2 border-[#D9A62E] flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#183D52] border border-[#D9A62E]/40 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-[#D9A62E]" />
            </div>
            <div>
              <h3 className="font-bold text-base uppercase tracking-wide">
                Roteiro de Diagnóstico em PDF / Word
              </h3>
              <p className="text-[11px] text-[#9FC4D8]">
                Bússola Gestão Automotiva • Questionário dos 4 Quadrantes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#183D52] hover:bg-[#22506b] text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          <div className="bg-[#FBF8F0] border border-[#D5DDE2] rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#D9A62E] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-[#102B3F]">
                Documento Pronto para Mentoria, Consultoria e Formulários
              </p>
              <p className="text-[#6B7780] leading-relaxed">
                Este roteiro contém as <strong>12 perguntas oficiais</strong> e a justificativa metodológica de cada uma. Baixe no formato ideal para enviar ao seu mentorado ou imprimir para a reunião de diagnóstico.
              </p>
            </div>
          </div>

          {/* Download cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card PDF */}
            <div className="border border-[#D5DDE2] rounded-xl p-4 bg-[#F8FAFC] flex flex-col justify-between hover:border-[#102B3F] transition-all">
              <div className="space-y-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#102B3F] flex items-center justify-center text-[#D9A62E]">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#102B3F]">
                  Formulário em PDF (.pdf)
                </h4>
                <p className="text-[11px] text-[#6B7780]">
                  Layout visual diagramado no padrão oficial da Bússola, com campos de preenchimento, cabeçalho e rodapé.
                </p>
              </div>

              <button
                onClick={handleDownloadPDF}
                disabled={generatingPdf}
                className="w-full py-2.5 bg-[#102B3F] hover:bg-[#183D52] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#D9A62E]" />
                <span>{generatingPdf ? 'Gerando PDF...' : 'Baixar Arquivo PDF'}</span>
              </button>
            </div>

            {/* Card Word */}
            <div className="border border-[#D5DDE2] rounded-xl p-4 bg-[#F8FAFC] flex flex-col justify-between hover:border-[#102B3F] transition-all">
              <div className="space-y-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#102B3F] flex items-center justify-center text-[#D9A62E]">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#102B3F]">
                  Documento Word (.docx)
                </h4>
                <p className="text-[11px] text-[#6B7780]">
                  Tabela 100% editável no Microsoft Word ou Google Docs para você personalizar perguntas ou adicionar o logotipo da sua oficina.
                </p>
              </div>

              <button
                onClick={handleDownloadWord}
                disabled={generatingWord}
                className="w-full py-2.5 bg-[#102B3F] hover:bg-[#183D52] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#D9A62E]" />
                <span>{generatingWord ? 'Gerando Word...' : 'Baixar Arquivo Word'}</span>
              </button>
            </div>

          </div>

          {/* Quick Copy Text */}
          <div className="border border-[#D5DDE2] rounded-xl p-4 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#102B3F] uppercase tracking-wide">
                Texto para Google Forms / Typeform / WhatsApp
              </span>
              <button
                onClick={handleCopyText}
                className="px-3 py-1 bg-[#EAF3F8] hover:bg-[#d5e7f2] text-[#102B3F] text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#D9A62E]" />
                    <span>Copiar Texto Completo</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#6B7780]">
              Copie todas as perguntas e finalidades metodológicas para colar direto no criador de formulários online da sua mentoria.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#F4F7F9] px-6 py-3 border-t border-[#D5DDE2] flex justify-between items-center text-xs">
          <span className="text-[11px] text-[#6B7780]">
            Bússola Gestão Automotiva • Método dos 4 Quadrantes
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#102B3F] text-[#D9A62E] hover:bg-[#183D52] font-bold rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
