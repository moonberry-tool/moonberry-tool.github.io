import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode, Language, ActiveTool, ViewMode } from '../types';

// Map each tool to its own URL path, and back. Keeps the address bar in sync
// with the app view, and lets a hard refresh / direct link land on the right tool.
const TOOL_PATHS: Record<ActiveTool, string> = {
  colors: '/colors/',
  fonts: '/fonts/',
  grid: '/grid/',
  prompts: '/prompts/',
  imageGen: '/image-generator/',
  settings: '/settings/',
  admin: '/admin/',
};

const PATH_TO_TOOL: Record<string, ActiveTool> = Object.entries(TOOL_PATHS).reduce(
  (acc, [tool, path]) => {
    acc[path] = tool as ActiveTool;
    return acc;
  },
  {} as Record<string, ActiveTool>
);

const getToolFromCurrentPath = (): { tool: ActiveTool; mode: ViewMode } => {
  const path = window.location.pathname;
  const normalized = path.endsWith('/') ? path : `${path}/`;
  const matchedTool = PATH_TO_TOOL[normalized];
  if (matchedTool) {
    return { tool: matchedTool, mode: 'app' };
  }
  return { tool: 'colors', mode: 'landing' };
};

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

  const initialRoute = getToolFromCurrentPath();
  const [viewMode, setViewModeState] = useState<ViewMode>(initialRoute.mode);
  const [activeTool, setActiveToolState] = useState<ActiveTool>(initialRoute.tool);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Keep the address bar correct for a given tool/mode combo
  const syncUrl = (tool: ActiveTool, mode: ViewMode) => {
    const targetPath = mode === 'landing' ? '/' : TOOL_PATHS[tool];
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  // Wrapped setters: same signatures the rest of the app already uses,
  // but they also push the correct URL.
  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    syncUrl(activeTool, mode);
  };

  const setActiveTool = (tool: ActiveTool) => {
    setActiveToolState(tool);
    setViewModeState('app');
    syncUrl(tool, 'app');
  };

  // Handle browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const route = getToolFromCurrentPath();
      setActiveToolState(route.tool);
      setViewModeState(route.mode);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    setActiveToolState(tool);
    setViewModeState('app');
    syncUrl(tool, 'app');
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
