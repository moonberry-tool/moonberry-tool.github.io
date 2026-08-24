import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode, Language, ActiveTool, ViewMode } from '../types';
import { auth, db } from '../firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { AuthModal } from '../components/common/AuthModal';

// Placeholder values — real pricing plan comes in Phase 3, these just make the
// gating logic functional for now.
const FREE_PLAN_LIMITED_MODEL_CREDITS = 2; // 2 free generations on non-Flux models
const PAID_PLAN_PLACEHOLDER_CREDITS = 100; // TODO: replace once pricing plan is set

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
  // Auth & credits (Phase 2)
  user: FirebaseUser | null;
  authLoading: boolean;
  userPlan: 'free' | 'paid';
  credits: number;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  consumeCredit: () => Promise<boolean>;
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

  // --- Auth & Credits (Phase 2) ---
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<'free' | 'paid'>('free');
  const [credits, setCredits] = useState<number>(FREE_PLAN_LIMITED_MODEL_CREDITS);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Create the user's Firestore profile on first login, or load it on return visits
  const ensureUserDoc = async (fbUser: FirebaseUser) => {
    const ref = doc(db, 'users', fbUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        email: fbUser.email,
        displayName: fbUser.displayName || '',
        plan: 'free',
        credits: FREE_PLAN_LIMITED_MODEL_CREDITS,
        createdAt: new Date().toISOString(),
      });
      setUserPlan('free');
      setCredits(FREE_PLAN_LIMITED_MODEL_CREDITS);
    } else {
      const data = snap.data();
      setUserPlan(data.plan === 'paid' ? 'paid' : 'free');
      setCredits(typeof data.credits === 'number' ? data.credits : FREE_PLAN_LIMITED_MODEL_CREDITS);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async fbUser => {
      setUser(fbUser);
      if (fbUser) {
        await ensureUserDoc(fbUser);
      } else {
        setUserPlan('free');
        setCredits(FREE_PLAN_LIMITED_MODEL_CREDITS);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    closeAuthModal();
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    closeAuthModal();
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    closeAuthModal();
  };

  const logout = async () => {
    await signOut(auth);
  };

  // Deducts one credit for a non-Flux generation. Returns false if the user
  // isn't logged in or has none left (caller should show the upgrade message).
  // NOTE: this trusts the client to only call it after a successful generation.
  // Phase 3 should move this behind a Cloud Function once real payments exist,
  // so a user can't edit their own credits via devtools.
  const consumeCredit = async (): Promise<boolean> => {
    if (!user) return false;
    if (credits <= 0) return false;
    try {
      await updateDoc(doc(db, 'users', user.uid), { credits: increment(-1) });
      setCredits(prev => Math.max(0, prev - 1));
      return true;
    } catch {
      return false;
    }
  };

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
        user,
        authLoading,
        userPlan,
        credits,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logout,
        consumeCredit,
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
      {isAuthModalOpen && <AuthModal />}
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
