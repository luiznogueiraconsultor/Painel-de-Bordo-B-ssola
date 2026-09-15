import React, { useState } from 'react';
import {
  Share2,
  Code2,
  Copy,
  Check,
  Globe,
  ExternalLink,
  Download,
  FileCode,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { DashboardInputs, DashboardCalculations } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: DashboardInputs;
  calcs: DashboardCalculations;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  inputs,
  calcs,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'link' | 'embed' | 'standalone'>('link');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [includeStateInUrl, setIncludeStateInUrl] = useState(true);
  const [responsiveHeight, setResponsiveHeight] = useState('800px');

  if (!isOpen) return null;

  // Generate current URL with state or clean URL
  const getShareableUrl = () => {
    try {
      let hostOrigin = window.location.origin;
      // In Google AI Studio development container, convert the private -dev- URL into the public -pre- URL if applicable
      if (hostOrigin.includes('-dev-') && hostOrigin.includes('.run.app')) {
        hostOrigin = hostOrigin.replace('-dev-', '-pre-');
      }
      const baseUrl = hostOrigin + window.location.pathname;
      if (!includeStateInUrl) {
        return baseUrl;
      }
      // Encode inputs as a compressed query param
      const encodedData = encodeURIComponent(JSON.stringify(inputs));
      return `${baseUrl}?dados=${encodedData}`;
    } catch {
      return window.location.href;
    }
  };

  const currentShareUrl = getShareableUrl();

  const iframeEmbedCode = `<iframe
  src="${currentShareUrl}"
  width="100%"
  height="${responsiveHeight}"
  style="border: 1px solid #D5DDE2; border-radius: 12px; box-shadow: 0 4px 12px rgba(16,43,63,0.08);"
  title="Painel de Bordo do Gestor - Bússola Gestão Automotiva"
  loading="lazy"
  allow="clipboard-write"
></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(iframeEmbedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  // Generate a standalone HTML file that can be hosted anywhere or embedded directly
  const handleDownloadStandaloneHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Painel de Bordo do Gestor | Bússola Gestão Automotiva</title>
  <meta name="description" content="Cockpit Operacional dos 4 Quadrantes: Produtividade, CPH Real, Margem Comercial e Refugo Operacional." />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #F4F7F9;
      color: #173042;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .header-bar {
      background: #102B3F;
      color: #ffffff;
      padding: 16px 24px;
      border-bottom: 4px solid #D9A62E;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .brand-sub {
      color: #D9A62E;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
    }
    .iframe-wrapper {
      flex: 1;
      width: 100%;
      height: calc(100vh - 80px);
      min-height: 750px;
      position: relative;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  </style>
</head>
<body>
  <div class="iframe-wrapper">
    <iframe
      src="${currentShareUrl}"
      title="Painel de Bordo do Gestor - Bússola Gestão Automotiva"
      allow="clipboard-write"
    ></iframe>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `painel-bordo-gestor-bussola-${inputs.periodo.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#D5DDE2] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#102B3F] px-6 py-4 border-b-2 border-[#D9A62E] flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#183D52] border border-[#D9A62E]/40 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-[#D9A62E]" />
            </div>
            <div>
              <h3 className="font-bold text-base uppercase tracking-wide">
                Compartilhar & Integrar Painel
              </h3>
              <p className="text-[11px] text-[#9FC4D8]">
                Bússola Gestão Automotiva • Cockpit do Gestor
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

        {/* Sub Navigation */}
        <div className="bg-[#EAF3F8] border-b border-[#D5DDE2] px-6 flex gap-2 pt-2">
          <button
            onClick={() => setActiveSubTab('link')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'link'
                ? 'bg-white text-[#102B3F] border-t-2 border-[#D9A62E] shadow-xs'
                : 'text-[#6B7780] hover:text-[#102B3F]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#D9A62E]" />
            <span>Link Direto (URL)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('embed')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'embed'
                ? 'bg-white text-[#102B3F] border-t-2 border-[#D9A62E] shadow-xs'
                : 'text-[#6B7780] hover:text-[#102B3F]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#D9A62E]" />
            <span>Código Embed (HTML / iFrame)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('standalone')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'standalone'
                ? 'bg-white text-[#102B3F] border-t-2 border-[#D9A62E] shadow-xs'
                : 'text-[#6B7780] hover:text-[#102B3F]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-[#D9A62E]" />
            <span>Arquivo .HTML para Download</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Options toggle */}
          <div className="bg-[#FBF8F0] border border-[#D5DDE2] rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-[#D9A62E] shrink-0" />
              <div>
                <span className="font-bold text-[#102B3F] block">
                  Incluir dados atuais do período ({inputs.periodo})
                </span>
                <span className="text-[11px] text-[#6B7780]">
                  Quem abrir o link verá exatamente os números preenchidos agora.
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeStateInUrl}
                onChange={(e) => setIncludeStateInUrl(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#102B3F]"></div>
            </label>
          </div>

          {/* TAB 1: Link Direto */}
          {activeSubTab === 'link' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#173042] uppercase tracking-wide">
                  Link de Acesso Direto para Compartilhar
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentShareUrl}
                    className="flex-1 bg-[#F4F7F9] border border-[#D5DDE2] rounded-lg px-3 py-2 text-xs text-[#102B3F] font-mono select-all focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-[#102B3F] hover:bg-[#183D52] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#2E7D32]" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#D9A62E]" />
                        <span>Copiar Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-[#EAF3F8] rounded-xl border border-[#9FC4D8]/40 flex flex-col justify-between">
                  <div>
                    <p className="font-bold text-[#102B3F] mb-1 flex items-center gap-1.5">
                      <span>📱</span> Enviar via WhatsApp
                    </p>
                    <p className="text-[11px] text-[#6B7780] mb-3">
                      Abre a conversa do WhatsApp com o link e mensagem explicativa formatada.
                    </p>
                  </div>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Acesse o Painel de Bordo do Gestor (Método Bússola Gestão Automotiva):\n${currentShareUrl}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg font-bold text-xs transition-colors"
                  >
                    <span>Abrir no WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-3.5 bg-[#EAF3F8] rounded-xl border border-[#9FC4D8]/40 flex flex-col justify-between">
                  <div>
                    <p className="font-bold text-[#102B3F] mb-1 flex items-center gap-1.5">
                      <span>📧</span> Enviar por E-mail
                    </p>
                    <p className="text-[11px] text-[#6B7780] mb-3">
                      Cria um e-mail com assunto e link do cockpit pronto para o seu cliente ou aluno.
                    </p>
                  </div>
                  <a
                    href={`mailto:?subject=${encodeURIComponent('Painel de Bordo do Gestor - Bússola Gestão Automotiva')}&body=${encodeURIComponent(`Olá!\n\nAqui está o link de acesso ao seu Painel de Bordo dos 4 Quadrantes:\n${currentShareUrl}\n\nAbraços,\nEquipe Escola de Negócios Automotivos`)}`}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#102B3F] hover:bg-[#183D52] text-white rounded-lg font-bold text-xs transition-colors"
                  >
                    <span>Abrir no E-mail</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="p-3 bg-[#FBF8F0] rounded-lg border border-[#D5DDE2] text-xs">
                <p className="text-[11px] text-[#6B7780]">
                  💡 <strong>Link 100% Livre e Público:</strong> O link gerado acima utiliza o endereço público de visualização (<code className="font-mono text-[#102B3F] font-bold">ais-pre-...</code>), portanto não solicita login do Google e não pede senha do desenvolvedor para abrir.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Embed Code */}
              {/* TAB 2: Embed Code */}
              {activeSubTab === 'embed' && (
                <div className="space-y-4">
                  {/* Warning regarding Google AI Studio iframe policy */}
                  <div className="p-3.5 bg-[#FFF9E6] border border-[#D9A62E]/50 rounded-xl text-xs space-y-2">
                    <p className="font-bold text-[#8A660E] flex items-center gap-1.5 text-xs">
                      <span>⚠️</span> Por que o link do teste pode ser bloqueado no iFrame?
                    </p>
                    <p className="text-[11px] text-[#5C450B] leading-relaxed">
                      O ambiente de desenvolvimento do Google AI Studio (<code className="font-mono bg-white/70 px-1 py-0.5 rounded text-[#102B3F]">*.run.app</code>) envia automaticamente o cabeçalho de proteção <code className="font-mono bg-white/70 px-1 py-0.5 rounded text-[#102B3F]">frame-ancestors 'self' https://*.google.com</code>. Por motivos de segurança do Google, os navegadores impedem que links temporários de teste sejam embutidos em domínios externos.
                    </p>
                    <div className="pt-1 text-[11px] text-[#102B3F] font-semibold">
                      💡 <strong>Solução Definitiva:</strong> Para ter o painel rodando liso em <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#D9A62E]/40">escoladenegociosautomotivo.com.br/painel-de-bordo</code>, utilize a <strong>Opção 1 (Hospedagem Nativa na pasta do site)</strong> ou faça o deploy em produção (Vercel, Netlify ou Cloud Run). Veja as instruções detalhadas abaixo.
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#173042] uppercase tracking-wide">
                        Código HTML para Testes (iFrame)
                      </label>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[11px] text-[#6B7780]">Altura:</span>
                        <select
                          value={responsiveHeight}
                          onChange={(e) => setResponsiveHeight(e.target.value)}
                          className="text-xs border border-[#D5DDE2] rounded px-1.5 py-0.5 bg-white font-medium"
                        >
                          <option value="650px">650px (Compacto)</option>
                          <option value="800px">800px (Padrão)</option>
                          <option value="1000px">1000px (Expandido)</option>
                          <option value="100vh">100vh (Tela cheia)</option>
                        </select>
                      </div>
                    </div>

                    <div className="relative">
                      <pre className="bg-[#102B3F] text-[#9FC4D8] p-3 rounded-lg text-[11px] font-mono overflow-x-auto leading-relaxed border border-[#D9A62E]/30">
                        {iframeEmbedCode}
                      </pre>
                      <button
                        onClick={handleCopyEmbed}
                        className="absolute top-2 right-2 px-3 py-1.5 bg-[#D9A62E] hover:bg-[#e5b138] text-[#102B3F] text-xs font-bold rounded flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                      >
                        {copiedEmbed ? (
                          <>
                            <Check className="w-3 h-3 text-[#102B3F]" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[#102B3F]" />
                            <span>Copiar Código</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#EAF3F8] p-3.5 rounded-lg border border-[#9FC4D8]/50 text-xs space-y-2">
                    <p className="font-bold text-[#102B3F] flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-[#D9A62E]" />
                      Como publicar em produção sem nenhum bloqueio:
                    </p>
                    <div className="text-[11px] text-[#173042] space-y-2 pl-1">
                      <p>
                        <strong>1. Hospedagem Direta na sua pasta (Recomendado):</strong> Baixe os arquivos do projeto compilados e suba na pasta <code className="font-mono bg-white px-1 py-0.5 rounded">public_html/painel-de-bordo</code> do seu cPanel/Hostinger. O app roda 100% nativo no seu domínio sem usar iFrame!
                      </p>
                      <p>
                        <strong>2. Deploy Gratuito na Vercel / Netlify:</strong> Conecte o repositório GitHub à Vercel (leva 1 minuto). A Vercel não bloqueia iframes e permite apontar o subdomínio <code className="font-mono bg-white px-1 py-0.5 rounded">painel.escoladenegociosautomotivo.com.br</code>.
                      </p>
                      <p>
                        <strong>3. Deploy no Google Cloud Run:</strong> No menu superior direito do AI Studio, clique em &ldquo;Deploy&rdquo; para criar sua instância própria de produção.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Standalone HTML */}
              {activeSubTab === 'standalone' && (
                <div className="space-y-4">
                  <div className="border border-[#D5DDE2] rounded-xl p-4 bg-[#FBF8F0] space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#102B3F] flex items-center justify-center text-[#D9A62E] shrink-0">
                        <FileCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#102B3F]">
                          Guia de Publicação no seu Site Oficial
                        </h4>
                        <p className="text-[11px] text-[#6B7780]">
                          Publique diretamente em <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#D5DDE2]">escoladenegociosautomotivo.com.br/painel-de-bordo</code> com alta velocidade e sem bloqueios.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-[#D5DDE2] text-xs space-y-2">
                      <p className="font-bold text-[#102B3F]">Como ter a ferramenta nativa no seu domínio:</p>
                      <ol className="list-decimal list-inside text-[11px] text-[#6B7780] space-y-1.5">
                        <li>No menu do Google AI Studio (canto superior direito), clique nos três pontos (<strong>...</strong>) ou em <strong>Export / Download as ZIP</strong>.</li>
                        <li>Extraia o arquivo ou pegue a pasta de build (<code className="font-mono text-[#102B3F]">dist/</code>).</li>
                        <li>No gerenciador de arquivos da sua hospedagem (cPanel / Hostinger / FTP), crie a pasta <code className="font-mono text-[#102B3F]">painel-de-bordo</code> e envie os arquivos para lá.</li>
                        <li>Pronto! O painel funcionará direto no seu domínio com carregamento instantâneo.</li>
                      </ol>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleDownloadStandaloneHtml}
                        className="w-full py-3 bg-gradient-to-r from-[#102B3F] to-[#183D52] hover:from-[#183D52] hover:to-[#22506b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-[#D9A62E]/40 shadow-sm transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-[#D9A62E]" />
                        <span>Baixar Código de Incorporação (.html)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

        </div>

        {/* Footer */}
        <div className="bg-[#F4F7F9] px-6 py-3 border-t border-[#D5DDE2] flex justify-between items-center text-xs">
          <span className="text-[11px] text-[#6B7780]">
            Bússola Gestão Automotiva — Cockpit do Gestor v2.0
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
