import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MoonberryLogo } from './MoonberryLogo';
import { CommandPalette } from './CommandPalette';
import { BackupRestoreModal } from './BackupRestoreModal';
import { 
  Palette, 
  Type, 
  Grid3X3, 
  Sparkles, 
  Sun, 
  Moon, 
  ArrowLeft, 
  ArrowRight,
  Sliders,
  Command,
  Database,
  ImageIcon,
  LogIn,
  LogOut,
  Coins,
  CreditCard
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    language, 
    setLanguage, 
    viewMode, 
    setViewMode, 
    openTool,
    user,
    credits,
    openAuthModal,
    logout
  } = useApp();

  const isRtl = language === 'ar';
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  return (
    <>
      <header
        id="moonberry-global-navbar"
        className="sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-200 bg-[#0f0714]/90 border-white/10 dark:bg-[#0f0714]/90 dark:border-white/10 light:bg-[#FFFFFF]/95 light:border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => setViewMode('landing')}
            className="cursor-pointer flex items-center gap-3 select-none group relative"
            id="navbar-brand-logo-button"
          >
            <div className="absolute -inset-1 bg-[#f43f5e] rounded-full blur-md opacity-20 group-hover:opacity-50 transition-opacity" />
            <MoonberryLogo size="md" variant="full" />
          </div>

          {/* Quick Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {viewMode === 'landing' && (
              <nav className="flex items-center gap-1 bg-white/5 dark:bg-white/5 light:bg-slate-100 border border-white/10 dark:border-white/10 light:border-slate-200 p-1 rounded-full text-xs font-medium">
                <button
                  onClick={() => openTool('colors')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-slate-300 dark:text-slate-300 light:text-slate-600 hover:text-white dark:hover:text-white hover:bg-[#f43f5e]/20 transition-all"
                  id="nav-link-colors"
                >
                  <Palette className="w-3.5 h-3.5 text-[#f43f5e]" />
                  <span>{isRtl ? 'الألوان' : 'Colors'}</span>
                </button>
                <button
                  onClick={() => openTool('fonts')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-slate-300 dark:text-slate-300 light:text-slate-600 hover:text-white dark:hover:text-white hover:bg-[#8b5cf6]/20 transition-all"
                  id="nav-link-fonts"
                >
                  <Type className="w-3.5 h-3.5 text-[#8b5cf6]" />
                  <span>{isRtl ? 'الخطوط' : 'Fonts'}</span>
                </button>
                <button
                  onClick={() => openTool('grid')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-slate-300 dark:text-slate-300 light:text-slate-600 hover:text-white dark:hover:text-white hover:bg-[#38BDF8]/20 transition-all"
                  id="nav-link-grid"
                >
                  <Grid3X3 className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>{isRtl ? 'المقاسات' : 'Grids'}</span>
                </button>
                <button
                  onClick={() => openTool('prompts')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-slate-300 dark:text-slate-300 light:text-slate-600 hover:text-white dark:hover:text-white hover:bg-[#c026d3]/20 transition-all"
                  id="nav-link-prompts"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#c026d3]" />
                  <span>{isRtl ? 'البرومبتات' : 'Prompts'}</span>
                </button>
                <button
                  onClick={() => openTool('imageGen')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-slate-300 dark:text-slate-300 light:text-slate-600 hover:text-white dark:hover:text-white hover:bg-[#34D399]/20 transition-all"
                  id="nav-link-imagegen"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>{isRtl ? 'توليد الصور' : 'Image AI'}</span>
                </button>
                <button
                  onClick={() => openTool('pricing')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-slate-300 dark:text-slate-300 light:text-slate-600 hover:text-white dark:hover:text-white hover:bg-amber-400/20 transition-all"
                  id="nav-link-pricing"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isRtl ? 'الأسعار' : 'Pricing'}</span>
                </button>
              </nav>
            )}
          </div>

          {/* Right Actions: Account, Command Launcher, Backup, Theme, Language, Main CTA */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Account: login button or user badge with credits */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20"
                  title={isRtl ? 'الكريدت المتبقي على الموديلات المدفوعة' : 'Remaining credits for paid models'}
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>{credits}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f43f5e] to-[#8b5cf6] flex items-center justify-center text-xs font-extrabold text-white shrink-0">
                  {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-full border transition-all bg-white/5 border-white/10 text-slate-300 hover:text-[#f43f5e] hover:border-[#f43f5e]/60"
                  title={isRtl ? 'تسجيل الخروج' : 'Log out'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-[#8b5cf6]/60"
                id="navbar-login-button"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isRtl ? 'تسجيل الدخول' : 'Login'}</span>
              </button>
            )}
            
            {/* Quick Command Launcher Button */}
            <button
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-[#f43f5e]/60"
              title="Command Palette (Ctrl + K)"
              id="navbar-command-palette-btn"
            >
              <Command className="w-3.5 h-3.5 text-[#f43f5e]" />
              <span className="hidden sm:inline font-mono text-[10px] text-slate-400">⌘K</span>
            </button>

            {/* Backup & Restore Workspace Modal Trigger */}
            <button
              onClick={() => setIsBackupOpen(true)}
              className="p-2 rounded-full border transition-all bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-[#8b5cf6]/60"
              title={isRtl ? 'نسخ واسترجاع مساحة العمل' : 'Backup & Restore Workspace'}
              id="navbar-backup-btn"
            >
              <Database className="w-4 h-4 text-[#8b5cf6]" />
            </button>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-[#f43f5e]/60 dark:bg-white/5 dark:border-white/10 dark:text-slate-300 light:bg-slate-100 light:border-slate-200 light:text-slate-700"
              title={isRtl ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
              id="navbar-language-toggle-button"
            >
              {language === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border transition-all bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-[#f43f5e]/60 dark:bg-white/5 dark:border-white/10 dark:text-slate-300 light:bg-slate-100 light:border-slate-200 light:text-slate-700"
              aria-label="Toggle theme"
              id="navbar-theme-toggle-button"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#FDE047]" />
              ) : (
                <Moon className="w-4 h-4 text-[#8b5cf6]" />
              )}
            </button>

            {/* Primary Action Button - Vibrant Palette Style */}
            {viewMode === 'landing' ? (
              <button
                onClick={() => openTool('colors')}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-[#0f0714] bg-white shadow-[0_0_25px_rgba(244,63,94,0.35)] hover:scale-105 active:scale-95 transition-all duration-200"
                id="navbar-launch-app-button"
              >
                <span>{isRtl ? 'استكشف التطبيق' : 'Explore App'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4 text-[#f43f5e]" /> : <ArrowRight className="w-4 h-4 text-[#f43f5e]" />}
              </button>
            ) : (
              <button
                onClick={() => setViewMode('landing')}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-all bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-[#f43f5e] dark:bg-white/5 dark:border-white/10 light:bg-slate-100 light:border-slate-200 light:text-slate-700"
                id="navbar-back-to-landing-button"
              >
                <span>{isRtl ? 'الصفحة الرئيسية' : 'Home'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Global Modals */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
      <BackupRestoreModal isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} />
    </>
  );
};

