import React, { useState, useEffect, useRef } from 'react';
import { Compass, Upload, Image as ImageIcon, RotateCcw, Check, Sparkles } from 'lucide-react';

interface BussolaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  allowCustomUpload?: boolean;
}

const STORAGE_KEY_CUSTOM_LOGO = 'painel_gestor_bussola_custom_logo';

export const BussolaLogo: React.FC<BussolaLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  allowCustomUpload = true,
}) => {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_CUSTOM_LOGO);
    } catch {
      return null;
    }
  });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Por favor, selecione uma imagem de até 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomLogoUrl(result);
          try {
            localStorage.setItem(STORAGE_KEY_CUSTOM_LOGO, result);
          } catch (err) {
            console.error('Falha ao salvar logo customizada', err);
          }
          setIsUploadModalOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUrl = () => {
    if (urlInput.trim()) {
      setCustomLogoUrl(urlInput.trim());
      try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_LOGO, urlInput.trim());
      } catch (err) {
        console.error('Falha ao salvar logo customizada', err);
      }
      setUrlInput('');
      setIsUploadModalOpen(false);
    }
  };

  const handleResetToDefault = () => {
    setCustomLogoUrl(null);
    try {
      localStorage.removeItem(STORAGE_KEY_CUSTOM_LOGO);
    } catch {}
    setIsUploadModalOpen(false);
  };

  const boxDimensions = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11 sm:w-12 sm:h-12',
    lg: 'w-14 h-14',
  }[size];

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Logo Container / Emblem */}
        <div
          onClick={() => allowCustomUpload && setIsUploadModalOpen(true)}
          className={`relative ${boxDimensions} bg-white rounded-lg flex items-center justify-center p-1 shadow-sm border border-[#D5DDE2]/60 hover:border-[#D9A62E] transition-all cursor-pointer group shrink-0 select-none`}
          title={allowCustomUpload ? 'Clique para alterar/personalizar a logomarca da Bússola' : 'Logomarca Bússola'}
        >
          {customLogoUrl ? (
            <img
              src={customLogoUrl}
              alt="Logomarca Bússola"
              className="w-full h-full object-contain rounded"
              referrerPolicy="no-referrer"
            />
          ) : (
            /* Official Vector Emblem of Bússola */
            <div className="w-full h-full bg-[#102B3F] rounded-[5px] flex items-center justify-center relative overflow-hidden shadow-inner group-hover:scale-[1.02] transition-transform">
              {/* Outer compass ring */}
              <svg viewBox="0 0 100 100" className="w-full h-full p-0.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Dial background circle */}
                <circle cx="50" cy="50" r="46" stroke="#D9A62E" strokeWidth="2.5" strokeOpacity="0.4" />
                <circle cx="50" cy="50" r="40" stroke="#9FC4D8" strokeWidth="1" strokeDasharray="2 3" strokeOpacity="0.6" />
                
                {/* Cardinal Tick Marks */}
                <line x1="50" y1="6" x2="50" y2="14" stroke="#D9A62E" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="50" y1="86" x2="50" y2="94" stroke="#D9A62E" strokeWidth="2" strokeLinecap="round" />
                <line x1="6" y1="50" x2="14" y2="50" stroke="#D9A62E" strokeWidth="2" strokeLinecap="round" />
                <line x1="86" y1="50" x2="94" y2="50" stroke="#D9A62E" strokeWidth="2" strokeLinecap="round" />

                {/* Diagonal secondary points */}
                <polygon points="50,50 46,46 50,22 54,46" fill="#9FC4D8" fillOpacity="0.35" />
                <polygon points="50,50 46,54 50,78 54,54" fill="#9FC4D8" fillOpacity="0.35" />
                <polygon points="50,50 46,46 22,50 46,54" fill="#9FC4D8" fillOpacity="0.35" />
                <polygon points="50,50 54,46 78,50 54,54" fill="#9FC4D8" fillOpacity="0.35" />

                {/* Primary North/South Needle (Gold & Navy) */}
                {/* North Pointer (Gold) */}
                <polygon points="50,12 56,47 50,50" fill="#E5B138" />
                <polygon points="50,12 44,47 50,50" fill="#D9A62E" />

                {/* South Pointer (Silver/Navy) */}
                <polygon points="50,88 56,53 50,50" fill="#9FC4D8" />
                <polygon points="50,88 44,53 50,50" fill="#6B7780" />

                {/* Center Core Cap */}
                <circle cx="50" cy="50" r="5" fill="#D9A62E" />
                <circle cx="50" cy="50" r="2.5" fill="#102B3F" />
              </svg>
            </div>
          )}

          {/* Hover indicator for customization */}
          {allowCustomUpload && (
            <div className="absolute inset-0 bg-[#102B3F]/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[9px] font-bold text-white text-center p-1">
              <span>Alterar</span>
            </div>
          )}
        </div>

        {/* Brand Typography */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-lg sm:text-xl font-black tracking-tight text-white uppercase font-sans flex items-center gap-1">
              <span>BÚSSOLA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9A62E] inline-block mb-0.5"></span>
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold bg-[#D9A62E]/20 text-[#D9A62E] border border-[#D9A62E]/40 rounded tracking-wider uppercase">
              Oficial
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#D9A62E] uppercase">
              GESTÃO AUTOMOTIVA
            </span>
          )}
        </div>
      </div>

      {/* Modal for Custom Logo Upload */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#D5DDE2] shadow-2xl w-full max-w-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#D5DDE2] pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#D9A62E]" />
                <h3 className="font-bold text-[#102B3F] text-base">
                  Personalizar Logomarca Bússola
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-[#6B7780] hover:text-[#102B3F] text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#6B7780] leading-relaxed">
              Você pode usar o emblema oficial vetorial da <strong>Bússola Gestão Automotiva</strong> ou enviar a imagem da sua logomarca personalizada (PNG, JPG ou SVG).
            </p>

            {/* Current Preview */}
            <div className="bg-[#FBF8F0] border border-[#D5DDE2] rounded-xl p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-[#102B3F] rounded-lg p-1 flex items-center justify-center shrink-0 border border-[#D9A62E]">
                {customLogoUrl ? (
                  <img
                    src={customLogoUrl}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Compass className="w-10 h-10 text-[#D9A62E]" />
                )}
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-[#102B3F]">
                  {customLogoUrl ? 'Logomarca Personalizada Ativa' : 'Emblema Padrão Vetorial da Bússola'}
                </p>
                <p className="text-[11px] text-[#6B7780]">
                  {customLogoUrl ? 'Sua imagem está salva no navegador.' : 'Estilo oficial em alta definição.'}
                </p>
              </div>
            </div>

            {/* Upload from file */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#173042] block">
                1. Carregar arquivo de imagem do computador
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 bg-[#EAF3F8] hover:bg-[#d8eaf5] text-[#102B3F] border border-[#9FC4D8] rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#D9A62E]" />
                <span>Escolher arquivo de imagem (PNG, JPG, SVG)</span>
              </button>
            </div>

            {/* Upload via URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#173042] block">
                2. Ou colar link direto de imagem (URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://exemplo.com/minha-logo.png"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 text-xs border border-[#D5DDE2] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D9A62E]"
                />
                <button
                  type="button"
                  onClick={handleSaveUrl}
                  disabled={!urlInput.trim()}
                  className="px-4 py-2 bg-[#102B3F] text-white text-xs font-bold rounded-lg hover:bg-[#183D52] disabled:opacity-50 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-[#D5DDE2]">
              {customLogoUrl && (
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="text-xs text-[#C62828] hover:underline font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Emblema Oficial</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="ml-auto px-4 py-2 bg-[#102B3F] text-[#D9A62E] hover:bg-[#183D52] text-xs font-bold rounded-lg transition-colors"
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
