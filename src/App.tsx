/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { AppShell } from './components/app/AppShell';
import { MoonLoader } from './components/common/MoonLoader';

// Lazy-loaded: each tool only downloads its own code when it's actually opened,
// instead of all of them loading up front on the very first visit.
const ColorsToolPreview = lazy(() => import('./components/tools/ColorsToolPreview').then(m => ({ default: m.ColorsToolPreview })));
const FontsToolPreview = lazy(() => import('./components/tools/FontsToolPreview').then(m => ({ default: m.FontsToolPreview })));
const GridToolPreview = lazy(() => import('./components/tools/GridToolPreview').then(m => ({ default: m.GridToolPreview })));
const PromptsToolPreview = lazy(() => import('./components/tools/PromptsToolPreview').then(m => ({ default: m.PromptsToolPreview })));
const ImageGenToolPreview = lazy(() => import('./components/tools/ImageGenToolPreview').then(m => ({ default: m.ImageGenToolPreview })));
const PricingPage = lazy(() => import('./components/tools/PricingPage').then(m => ({ default: m.PricingPage })));
const AdminPanel = lazy(() => import('./components/tools/AdminPanel').then(m => ({ default: m.AdminPanel })));
const SettingsView = lazy(() => import('./components/tools/SettingsView').then(m => ({ default: m.SettingsView })));

const MainContent: React.FC = () => {
  const { viewMode, activeTool, toggleTheme, language, setLanguage } = useApp();

  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      // Toggle theme with Ctrl/Cmd + J
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        toggleTheme();
      }
      // Toggle language with Ctrl/Cmd + L
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setLanguage(language === 'ar' ? 'en' : 'ar');
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [toggleTheme, language, setLanguage]);

  if (viewMode === 'landing') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LandingPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppShell>
        <Suspense fallback={<MoonLoader />}>
          {activeTool === 'colors' && <ColorsToolPreview />}
          {activeTool === 'fonts' && <FontsToolPreview />}
          {activeTool === 'grid' && <GridToolPreview />}
          {activeTool === 'prompts' && <PromptsToolPreview />}
          {activeTool === 'imageGen' && <ImageGenToolPreview />}
          {activeTool === 'pricing' && <PricingPage />}
          {activeTool === 'admin' && <AdminPanel />}
          {activeTool === 'settings' && <SettingsView />}
        </Suspense>
      </AppShell>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

