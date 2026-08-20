import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTool } from '../../types';
import { MoonberryLogo } from '../common/MoonberryLogo';
import { 
  Palette, 
  Type, 
  Grid3X3, 
  Sparkles, 
  Settings, 
  Sun, 
  Moon, 
  PanelLeftClose, 
  PanelLeft, 
  Home, 
  Sliders, 
  Sparkle,
  ArrowRight,
  ArrowLeft,
  ShieldAlert
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const {
    theme,
    toggleTheme,
    language,
    setLanguage,
    activeTool,
    setActiveTool,
    setViewMode,
    isSidebarCollapsed,
    toggleSidebar
  } = useApp();

  const isRtl = language === 'ar';

  const navTools = [
    {
      id: 'colors' as ActiveTool,
      labelAr: 'الألوان والباليتات',
      labelEn: 'Colors & Palettes',
      icon: <Palette className="w-5 h-5 text-[#EC4899]" />,
      badge: 'PRO',
      badgeColor: 'bg-[#EC4899]/20 text-[#F472B6]',
    },
    {
      id: 'fonts' as ActiveTool,
      labelAr: 'توافق الخطوط (Fonts)',
      labelEn: 'Font Pairings',
      icon: <Type className="w-5 h-5 text-[#A78BFA]" />,
      badge: '4-TIER',
      badgeColor: 'bg-[#A78BFA]/20 text-[#DDD6FE]',
    },
    {
      id: 'grid' as ActiveTool,
      labelAr: 'الشبكات ومناطق الأمان',
      labelEn: 'Grids & Safe Areas',
      icon: <Grid3X3 className="w-5 h-5 text-[#38BDF8]" />,
      badge: 'GUIDES',
      badgeColor: 'bg-[#38BDF8]/20 text-[#38BDF8]',
    },
    {
      id: 'prompts' as ActiveTool,
      labelAr: 'مكتبة البرومبتات',
      labelEn: 'Curated Prompts',
      icon: <Sparkles className="w-5 h-5 text-[#FDE047]" />,
      badge: '24+',
      badgeColor: 'bg-[#FDE047]/20 text-[#FDE047]',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0f0714] dark:bg-[#0f0714] light:bg-[#F8FAFC] text-[#F3F4F6] dark:text-[#F3F4F6] light:text-[#111827] transition-colors duration-200">
      
      {/* Sidebar Navigation */}
      <aside
        id="moonberry-app-sidebar"
        className={`shrink-0 z-30 flex flex-col justify-between border-b md:border-b-0 ${
          isRtl ? 'md:border-l' : 'md:border-r'
        } border-white/10 dark:border-white/10 light:border-[#E2E8F0] bg-[#0a040e] dark:bg-[#0a040e] light:bg-[#FFFFFF] transition-all duration-300 ${
          isSidebarCollapsed ? 'w-full md:w-20' : 'w-full md:w-68'
        }`}
      >
        {/* Top Branding & Collapse Button */}
        <div>
          <div className="h-20 flex items-center justify-between px-4 border-b border-white/10 dark:border-white/10 light:border-[#E2E8F0]">
            <div 
              onClick={() => setViewMode('landing')}
              className="cursor-pointer flex items-center gap-3 overflow-hidden"
              id="sidebar-logo-button"
            >
              <MoonberryLogo 
                size="md" 
                variant={isSidebarCollapsed ? 'icon' : 'full'} 
                showTagline={!isSidebarCollapsed}
              />
            </div>

            <button
              onClick={toggleSidebar}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title={isSidebarCollapsed ? (isRtl ? 'توسيع القائمة' : 'Expand Sidebar') : (isRtl ? 'طي القائمة' : 'Collapse Sidebar')}
              id="sidebar-collapse-toggle-button"
            >
              {isSidebarCollapsed ? (
                isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Tools Section */}
          <div className="p-3">
            {!isSidebarCollapsed && (
              <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                {isRtl ? 'الأدوات الإبداعية' : 'TOOLS'}
              </div>
            )}

            <nav className="space-y-1.5">
              {navTools.map((tool) => {
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white shadow-[0_0_20px_rgba(244,63,94,0.35)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={isRtl ? tool.labelAr : tool.labelEn}
                    id={`sidebar-tool-${tool.id}`}
                  >
                    <div className="flex items-center gap-3">
                      {tool.icon}
                      {!isSidebarCollapsed && (
                        <span>{isRtl ? tool.labelAr : tool.labelEn}</span>
                      )}
                    </div>

                    {!isSidebarCollapsed && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : tool.badgeColor}`}>
                        {tool.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* System & Settings Bottom */}
        <div className="p-3 border-t border-white/10 dark:border-white/10 light:border-[#E2E8F0] space-y-1.5">
          {!isSidebarCollapsed && (
            <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              {isRtl ? 'النظام والتفضيلات' : 'SYSTEM'}
            </div>
          )}

          {/* Settings button */}
          <button
            onClick={() => setActiveTool('settings')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              activeTool === 'settings'
                ? 'bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] text-white shadow-[0_0_20px_rgba(244,63,94,0.35)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            id="sidebar-settings-button"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5" />
              {!isSidebarCollapsed && (
                <span>{isRtl ? 'الإعدادات' : 'Settings'}</span>
              )}
            </div>
          </button>

          {/* Return to Home Landing Page */}
          <button
            onClick={() => setViewMode('landing')}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-semibold text-slate-400 hover:text-[#f43f5e] hover:bg-white/5 transition-all"
            id="sidebar-home-link"
          >
            <Home className="w-4 h-4" />
            {!isSidebarCollapsed && (
              <span>{isRtl ? 'العودة للرئيسية' : 'Return to Home'}</span>
            )}
          </button>
        </div>

      </aside>

      {/* Main App Canvas Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Workspace Top Header Bar */}
        <header className="h-16 px-4 sm:px-8 border-b border-white/10 bg-[#0f0714]/80 backdrop-blur-xl flex items-center justify-between gap-4">
          
          {/* Breadcrumb & Active Tool Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span 
                onClick={() => setViewMode('landing')} 
                className="cursor-pointer hover:text-white transition-colors"
              >
                Moonberry
              </span>
              <span>/</span>
              <span className="text-[#f43f5e] capitalize font-bold">{activeTool}</span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-3 py-1.5 rounded-full text-xs font-bold border border-white/10 bg-white/5 text-slate-300 hover:border-[#f43f5e] transition-colors"
            >
              {language === 'ar' ? 'English' : 'عربي'}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:border-[#f43f5e] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FDE047]" /> : <Moon className="w-4 h-4 text-[#8b5cf6]" />}
            </button>

            <button
              onClick={() => setViewMode('landing')}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-white text-[#0f0714] hover:scale-105 transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)]"
            >
              <span>{isRtl ? 'صفحة الهبوط' : 'Landing'}</span>
            </button>
          </div>

        </header>

        {/* Active Tool View Body */}
        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </div>

      </main>

    </div>
  );
};
