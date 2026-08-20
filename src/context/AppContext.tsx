import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode, Language, ActiveTool, ViewMode } from '../types';

interface AppContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeTool: ActiveTool;
  setActiveTool: (tool: ActiveTool) => void;
  openTool: (tool: ActiveTool) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [language, setLanguage] = useState<Language>('ar');
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [activeTool, setActiveTool] = useState<ActiveTool>('colors');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    root.setAttribute('lang', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const openTool = (tool: ActiveTool) => {
    setActiveTool(tool);
    setViewMode('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage,
        viewMode,
        setViewMode,
        activeTool,
        setActiveTool,
        openTool,
        toastMessage,
        showToast,
        isSidebarCollapsed,
        toggleSidebar,
      }}
    >
      {children}
      {toastMessage && (
        <div
          id="moonberry-toast-notification"
          className="fixed bottom-6 right-6 left-6 sm:left-auto sm:right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#161936] text-white border border-[#7B2CBF]/40 shadow-xl shadow-purple-950/40 rounded-xl backdrop-blur-md text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
