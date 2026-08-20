import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTool } from '../../types';
import {
  Search,
  Palette,
  Type,
  Grid3X3,
  Sparkles,
  Settings,
  Home,
  Sun,
  Moon,
  Languages,
  Download,
  Upload,
  ArrowRight,
  Command,
  X,
  Check
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { viewMode, setViewMode, activeTool, openTool, language, setLanguage, theme, toggleTheme, showToast } = useApp();
  const isRtl = language === 'ar';
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'tool-colors',
      titleAr: 'أداة الألوان والباليتات',
      titleEn: 'Color Palette Studio',
      descAr: 'توليد باليتات، استخراج من صور، وفحص التباين',
      descEn: 'Generate palettes, extract from images, and test contrast',
      icon: Palette,
      color: '#f43f5e',
      run: () => {
        openTool('colors');
        onClose();
      }
    },
    {
      id: 'tool-fonts',
      titleAr: 'أداة تناغم وهيكلة الخطوط',
      titleEn: 'Typography Scale Engine',
      descAr: 'توافقات الخطوط العربية والإنجليزية والمقاييس الرياضية',
      descEn: 'Bilingual font pairings and mathematical ratios',
      icon: Type,
      color: '#8b5cf6',
      run: () => {
        openTool('fonts');
        onClose();
      }
    },
    {
      id: 'tool-grid',
      titleAr: 'مقاسات وشبكات الأمان',
      titleEn: 'Canvas Grids & Safe Area',
      descAr: 'مقاسات السوشيال والمطبوعات وتصدير PNG شفاف',
      descEn: 'Standard dimensions & transparent PNG guide export',
      icon: Grid3X3,
      color: '#38BDF8',
      run: () => {
        openTool('grid');
        onClose();
      }
    },
    {
      id: 'tool-prompts',
      titleAr: 'استوديو ومكتبة البرومبتات',
      titleEn: 'Curated AI Prompts Studio',
      descAr: 'أوامر Midjourney و Flux ومولد البرومبتات الذكي',
      descEn: 'Curated prompts and formula builder for designers',
      icon: Sparkles,
      color: '#f43f5e',
      run: () => {
        openTool('prompts');
        onClose();
      }
    },
    {
      id: 'go-home',
      titleAr: 'الصفحة الرئيسية للتعريف بالأداة',
      titleEn: 'Home Landing Page',
      descAr: 'العودة للصفحة التعريفية وشرح الميزات',
      descEn: 'Return to the main overview landing page',
      icon: Home,
      color: '#ffffff',
      run: () => {
        setViewMode('landing');
        onClose();
      }
    },
    {
      id: 'tool-settings',
      titleAr: 'الإعدادات والتفضيلات',
      titleEn: 'Preferences & Settings',
      descAr: 'تغيير المظهر، اللغة، ومعلومات الإصدار',
      descEn: 'Change theme, language, and system preferences',
      icon: Settings,
      color: '#94a3b8',
      run: () => {
        openTool('settings');
        onClose();
      }
    },
    {
      id: 'toggle-theme',
      titleAr: theme === 'dark' ? 'التحويل إلى الوضع الفاتح' : 'التحويل إلى الوضع الداكن',
      titleEn: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      descAr: 'تبديل المظهر البصري للواجهة',
      descEn: 'Toggle interface color theme',
      icon: theme === 'dark' ? Sun : Moon,
      color: '#f43f5e',
      run: () => {
        toggleTheme();
        onClose();
      }
    },
    {
      id: 'toggle-lang',
      titleAr: language === 'ar' ? 'Switch interface to English' : 'تحويل الواجهة إلى العربية',
      titleEn: language === 'ar' ? 'Switch to English' : 'التحويل للعربية',
      descAr: 'تبديل لغة الواجهة والاتجاه',
      descEn: 'Toggle bilingual UI direction',
      icon: Languages,
      color: '#8b5cf6',
      run: () => {
        setLanguage(language === 'ar' ? 'en' : 'ar');
        onClose();
      }
    }
  ];

  const filtered = actions.filter(a => {
    const term = query.toLowerCase();
    return (
      a.titleAr.toLowerCase().includes(term) ||
      a.titleEn.toLowerCase().includes(term) ||
      a.descAr.toLowerCase().includes(term) ||
      a.descEn.toLowerCase().includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#0f0714] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center px-6 py-4 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={isRtl ? 'اكتب للبحث أو الانتقال السريع لأي أداة... (مثال: ألوان، خطوط، برومبت، إعدادات)' : 'Type to search or jump to any tool...'}
            className="flex-1 bg-transparent text-white font-medium text-sm sm:text-base focus:outline-none placeholder:text-slate-500"
          />
          <kbd className="hidden sm:inline-block px-2 py-1 rounded bg-white/10 text-slate-400 text-[10px] font-mono font-bold">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-3 space-y-1 scrollbar-none">
          {filtered.length > 0 ? (
            filtered.map((action, idx) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.id}
                  onClick={action.run}
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/5 cursor-pointer transition-all group border border-transparent hover:border-white/10"
                >
                  <div className="flex items-center gap-3.5">
                    <div 
                      className="p-2.5 rounded-xl bg-white/5 group-hover:scale-110 transition-transform"
                      style={{ color: action.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-right">
                      <h4 className="text-sm font-bold text-white group-hover:text-[#f43f5e] transition-colors">
                        {isRtl ? action.titleAr : action.titleEn}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {isRtl ? action.descAr : action.descEn}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-slate-500 group-hover:text-white transition-colors">
                    {isRtl ? 'انتقال ←' : 'Jump →'}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              {isRtl ? 'لم يتم العثور على نتائج تطابق بحثك' : 'No actions found matching your query'}
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-6 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5 text-[#f43f5e]" />
            <span>Moonberry Quick Launcher</span>
          </span>
          <span className="hidden sm:inline font-mono">
            {isRtl ? 'اضغط ↵ للتنفيذ أو ESC للإغلاق' : 'Press ↵ to select • ESC to close'}
          </span>
        </div>
      </div>
    </div>
  );
};
