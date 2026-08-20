import React from 'react';
import { useApp } from '../../context/AppContext';
import { MoonberryLogo } from '../common/MoonberryLogo';
import { Sun, Moon, Palette, Type, Grid3X3, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    language, 
    setLanguage, 
    openTool, 
    setViewMode 
  } = useApp();
  const isRtl = language === 'ar';

  return (
    <footer 
      id="moonberry-global-footer"
      className="bg-[#08030b] dark:bg-[#08030b] light:bg-slate-100 text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm pt-16 pb-12 transition-colors duration-200 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10 dark:border-white/10 light:border-slate-200">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div 
              onClick={() => setViewMode('landing')}
              className="cursor-pointer inline-block"
              id="footer-logo-link"
            >
              <MoonberryLogo size="md" variant="full" />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-sm leading-relaxed">
              {isRtl
                ? 'أدوات ومرافق إبداعية متقدمة لمصممي الجرافيك وصنّاع المحتوى البصري. مصممة لتسريع اتخاذ القرارات اليومية بدقة واحترافية.'
                : 'Essential, high-utility design companions engineered specifically for graphic designers and creative professionals.'}
            </p>
          </div>

          {/* Quick Tools Navigation */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white dark:text-white light:text-slate-900">
              {isRtl ? 'الأدوات المتاحة' : 'Design Tools'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => openTool('colors')}
                  className="flex items-center gap-2 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                >
                  <Palette className="w-3.5 h-3.5 text-[#f43f5e]" />
                  <span>{isRtl ? 'أداة الألوان والباليتات' : 'Colors & Palette Generator'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openTool('fonts')}
                  className="flex items-center gap-2 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                >
                  <Type className="w-3.5 h-3.5 text-[#8b5cf6]" />
                  <span>{isRtl ? 'أداة تناغم الخطوط (Fonts)' : 'Font Pairing & Typography'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openTool('grid')}
                  className="flex items-center gap-2 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                >
                  <Grid3X3 className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>{isRtl ? 'مقاسات التصميم ومناطق الأمان' : 'Canvas Grids & Safe Margins'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openTool('prompts')}
                  className="flex items-center gap-2 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
                  <span>{isRtl ? 'مكتبة البرومبتات للمصممين' : 'Curated Prompts Library'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Preferences & System */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white dark:text-white light:text-slate-900">
              {isRtl ? 'التفضيلات' : 'Preferences'}
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 text-xs hover:border-[#f43f5e] transition-all"
                id="footer-theme-toggle"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#FDE047]" /> : <Moon className="w-3.5 h-3.5 text-[#8b5cf6]" />}
                <span>{theme === 'dark' ? (isRtl ? 'الوضع الداكن' : 'Dark Mode') : (isRtl ? 'الوضع الفاتح' : 'Light Mode')}</span>
              </button>

              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 text-xs hover:border-[#f43f5e] transition-all font-mono font-bold"
                id="footer-lang-toggle"
              >
                {language === 'ar' ? 'English (EN)' : 'العربية (AR)'}
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500 light:text-slate-400">
          <p>© {new Date().getFullYear()} Moonberry. All rights reserved. Creative Tools for Designers.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>v1.0.0 — Production Ready</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
