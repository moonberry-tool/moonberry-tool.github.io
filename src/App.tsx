/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { AppShell } from './components/app/AppShell';
import { ColorsToolPreview } from './components/tools/ColorsToolPreview';
import { FontsToolPreview } from './components/tools/FontsToolPreview';
import { GridToolPreview } from './components/tools/GridToolPreview';
import { PromptsToolPreview } from './components/tools/PromptsToolPreview';
import { SettingsView } from './components/tools/SettingsView';

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
      <Navbar />
      <AppShell>
        {activeTool === 'colors' && <ColorsToolPreview />}
        {activeTool === 'fonts' && <FontsToolPreview />}
        {activeTool === 'grid' && <GridToolPreview />}
        {activeTool === 'prompts' && <PromptsToolPreview />}
        {activeTool === 'settings' && <SettingsView />}
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

