import React from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Sun, Moon, Languages, Shield, Info, Check, Sparkles, Command } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage, showToast } = useApp();
  const isRtl = language === 'ar';

  return (
    <div className="space-y-8 max-w-3xl text-right" id="settings-tool-view">
      
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-2xl bg-[#f43f5e]/20 text-[#f43f5e] shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <Settings className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isRtl ? 'إعدادات النظام والتفضيلات' : 'Preferences & System Settings'}
          </h1>
        </div>
        <p className="text-sm text-slate-400">
          {isRtl ? 'تخصيص مظهر مساحة العمل واللغة والخيارات العامة لمونبيري' : 'Customize theme, interface language, and workspace preferences'}
        </p>
      </div>

      {/* Preference Cards */}
      <div className="space-y-6">
        
        {/* Theme Preference */}
        <div className="p-6 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-white mb-1">
                {isRtl ? 'مظهر الواجهة (Theme Mode)' : 'Appearance Mode'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRtl ? 'الوضع الداكن (Vibrant Palette) هو النمط الموصى به لمصممي الجرافيك.' : 'Dark Vibrant Palette mode is the high-contrast recommendation for designers.'}
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 rounded-full bg-white/5 border border-white/10 w-fit">
              <button
                onClick={() => theme !== 'dark' && toggleTheme()}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  theme === 'dark' ? 'bg-[#f43f5e] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>{isRtl ? 'داكن' : 'Dark'}</span>
              </button>

              <button
                onClick={() => theme !== 'light' && toggleTheme()}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  theme === 'light' ? 'bg-[#8b5cf6] text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>{isRtl ? 'فاتح' : 'Light'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Language Preference */}
        <div className="p-6 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-white mb-1">
                {isRtl ? 'لغة الواجهة (Interface Language)' : 'Interface Language'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRtl ? 'دعم كامل للغتين العربية والإنجليزية مع ضبط اتجاه الواجهة (RTL/LTR).' : 'Bilingual UI with dynamic RTL/LTR support.'}
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 rounded-full bg-white/5 border border-white/10 w-fit">
              <button
                onClick={() => setLanguage('ar')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  language === 'ar' ? 'bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                العربية (RTL)
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  language === 'en' ? 'bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                English (LTR)
              </button>
            </div>
          </div>
        </div>

        {/* Shortcuts card */}
        <div className="p-6 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#f43f5e]">
            <Command className="w-4 h-4" />
            <span>{isRtl ? 'اختصارات لوحة المفاتيح المفيدة' : 'Keyboard Shortcuts'}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="flex justify-between items-center p-3 rounded-2xl bg-black/40 border border-white/5">
              <span>{isRtl ? 'توليد ألوان جديدة' : 'Generate Palette'}</span>
              <kbd className="px-2.5 py-1 rounded bg-white/10 text-white font-mono text-[10px] font-bold">Space</kbd>
            </div>
            <div className="flex justify-between items-center p-3 rounded-2xl bg-black/40 border border-white/5">
              <span>{isRtl ? 'تبديل المظهر' : 'Toggle Theme'}</span>
              <kbd className="px-2.5 py-1 rounded bg-white/10 text-white font-mono text-[10px] font-bold">Ctrl + J</kbd>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="p-6 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8b5cf6]">
            <Info className="w-4 h-4" />
            <span>{isRtl ? 'معلومات الإصدار والمراحل' : 'Version & Roadmap Info'}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Moonberry Design Platform v1.2.0 • Phase 3 (Advanced Studio, Image Extractor, Transparent Safe-Zone Export, and Prompt Formula Builder).
          </p>
        </div>

      </div>

    </div>
  );
};

