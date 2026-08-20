import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FontLevel, FontPairingPreset } from '../../types';
import { INITIAL_FONT_PAIRINGS } from '../../data/initialData';
import { 
  Type, 
  RefreshCw, 
  Sparkles, 
  Sliders, 
  Languages, 
  Check, 
  Copy,
  Layers,
  Download,
  BookOpen,
  Maximize2,
  Lock,
  Unlock
} from 'lucide-react';

export const FontsToolPreview: React.FC = () => {
  const { language, showToast } = useApp();
  const isRtl = language === 'ar';

  const [targetLang, setTargetLang] = useState<'bilingual' | 'arabic' | 'english'>('bilingual');
  const [scaleRatio, setScaleRatio] = useState<number>(1.25); // Major Third
  const [baseSize, setBaseSize] = useState<number>(16);
  const [customTesterTextAr, setCustomTesterTextAr] = useState<string>('الإبداع يبدأ عندما تلتقي الدقة بالبساطة');
  const [customTesterTextEn, setCustomTesterTextEn] = useState<string>('Designing the Future of Visual Interfaces');
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'presets' | 'export'>('hierarchy');

  // Google Font Lists
  const arabicFonts = ['Alexandria', 'Cairo', 'Tajawal', 'Almarai', 'Amiri', 'Changa', 'Readex Pro'];
  const englishFonts = ['Outfit', 'Plus Jakarta Sans', 'Inter', 'Playfair Display', 'Space Grotesk', 'Cabinet Grotesk', 'Syne'];

  const [levels, setLevels] = useState<FontLevel[]>([
    {
      role: 'display',
      roleNameAr: 'العرض الرئيسي (Display)',
      roleNameEn: 'Display Title',
      fontName: 'Alexandria',
      weight: '900 ExtraBold',
      fontSize: '48px',
      lineHeight: '1.15',
      sampleTextAr: 'الإبداع يبدأ عندما تلتقي الدقة بالبساطة',
      sampleTextEn: 'Designing the Future of Visual Interfaces',
      locked: false,
    },
    {
      role: 'heading',
      roleNameAr: 'العناوين الفرعية (Heading)',
      roleNameEn: 'Secondary Heading',
      fontName: 'Outfit',
      weight: '700 Bold',
      fontSize: '28px',
      lineHeight: '1.25',
      sampleTextAr: 'هيكلة تايبوغرافي واضحة تمنح تصميمك جاذبية استثنائية',
      sampleTextEn: 'Harmonized Typographic Hierarchy for SaaS & Editorial',
      locked: false,
    },
    {
      role: 'body',
      roleNameAr: 'النصوص المقروءة (Body)',
      roleNameEn: 'Readable Body Content',
      fontName: 'Cairo',
      weight: '400 Regular',
      fontSize: '16px',
      lineHeight: '1.7',
      sampleTextAr: 'تضمن الخطوط المتوازنة في النصوص الطويلة راحة فائقة لعين المتلقي وتجربة قراءة انسيابية في مختلف الوسائط الرقمية والمطبوعة.',
      sampleTextEn: 'Body typography must maintain maximum legibility across extended reading sessions, high-density layouts, and multiple viewports.',
      locked: false,
    },
    {
      role: 'small',
      roleNameAr: 'الملاحظات والحواشي (Small)',
      roleNameEn: 'Captions & Metadata',
      fontName: 'Plus Jakarta Sans',
      weight: '500 Medium',
      fontSize: '12px',
      lineHeight: '1.4',
      sampleTextAr: 'تاريخ الإنشاء: أغسطس 2026 • معايير الجودة • حقوق الملكية محفوظة',
      sampleTextEn: 'CREATED: AUG 2026 • 300 DPI SPEC • ALL RIGHTS RESERVED',
      locked: false,
    },
  ]);

  // Scales
  const scales = [
    { label: 'Major Second (1.125)', ratio: 1.125, desc: 'Compact / Dense UI' },
    { label: 'Major Third (1.25)', ratio: 1.25, desc: 'Balanced / Web Standard' },
    { label: 'Perfect Fourth (1.333)', ratio: 1.333, desc: 'Editorial / High Contrast' },
    { label: 'Golden Ratio (1.618)', ratio: 1.618, desc: 'Expressive / Poster' },
  ];

  // Apply scale mathematically
  const applyScale = (ratio: number, base: number) => {
    setScaleRatio(ratio);
    const small = Math.round(base / ratio);
    const body = base;
    const heading = Math.round(base * ratio * ratio);
    const display = Math.round(base * Math.pow(ratio, 3.5));

    setLevels(prev => [
      { ...prev[0], fontSize: `${display}px` },
      { ...prev[1], fontSize: `${heading}px` },
      { ...prev[2], fontSize: `${body}px` },
      { ...prev[3], fontSize: `${small}px` },
    ]);
  };

  const handleShuffleFonts = () => {
    setLevels(prev =>
      prev.map(lvl => {
        if (lvl.locked) return lvl;
        const fontPool =
          targetLang === 'arabic'
            ? arabicFonts
            : targetLang === 'english'
            ? englishFonts
            : lvl.role === 'display' || lvl.role === 'body'
            ? arabicFonts
            : englishFonts;

        const randomFont = fontPool[Math.floor(Math.random() * fontPool.length)];
        return {
          ...lvl,
          fontName: randomFont,
        };
      })
    );
    showToast(isRtl ? 'تم توليد توافق تايبوغرافي جديد' : 'Generated new font pairing system');
  };

  const handleApplyPreset = (preset: FontPairingPreset) => {
    setLevels(prev => [
      { ...prev[0], fontName: preset.display },
      { ...prev[1], fontName: preset.heading },
      { ...prev[2], fontName: preset.body },
      { ...prev[3], fontName: preset.small },
    ]);
    setActiveTab('hierarchy');
    showToast(isRtl ? `تم تطبيق توافق: ${preset.name}` : `Applied pairing: ${preset.name}`);
  };

  const handleFontChange = (role: string, newFont: string) => {
    setLevels(prev =>
      prev.map(lvl => (lvl.role === role ? { ...lvl, fontName: newFont } : lvl))
    );
  };

  const toggleLevelLock = (role: string) => {
    setLevels(prev =>
      prev.map(lvl => (lvl.role === role ? { ...lvl, locked: !lvl.locked } : lvl))
    );
  };

  const getCssCode = () => {
    const fonts: string[] = Array.from(new Set(levels.map(l => l.fontName)));
    const googleFontImport = `@import url('https://fonts.googleapis.com/css2?family=${fonts
      .map(f => (f as string).replace(/\s+/g, '+') + ':wght@400;500;700;900')
      .join('&family=')}&display=swap');`;

    const rules = levels
      .map(
        lvl =>
          `.typography-${lvl.role} {\n  font-family: '${lvl.fontName}', sans-serif;\n  font-size: ${lvl.fontSize};\n  line-height: ${lvl.lineHeight};\n}`
      )
      .join('\n\n');

    return `${googleFontImport}\n\n${rules}`;
  };

  return (
    <div className="space-y-8" id="fonts-tool-view">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-2xl bg-[#8b5cf6]/20 text-[#8b5cf6] shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <Type className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isRtl ? 'أداة تناغم وهيكلة الخطوط (Typography Engine)' : 'Typography Pairing & Scale Engine'}
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            {isRtl
              ? 'توليد أنظمة خطوط رباعية المستويات تجمع بين العربي والإنجليزي، وحساب النسب الرياضية للتايبوغرافي.'
              : 'Generate 4-tier bilingual typography scales, adjust mathematical step ratios, and export CSS.'}
          </p>
        </div>

        {/* Top Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10">
            <button
              onClick={() => setTargetLang('bilingual')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                targetLang === 'bilingual' ? 'bg-[#8b5cf6] text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isRtl ? 'عربي + إنجليزي' : 'Bilingual'}
            </button>
            <button
              onClick={() => setTargetLang('arabic')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                targetLang === 'arabic' ? 'bg-[#8b5cf6] text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isRtl ? 'عربي' : 'Arabic'}
            </button>
            <button
              onClick={() => setTargetLang('english')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                targetLang === 'english' ? 'bg-[#8b5cf6] text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isRtl ? 'إنجليزي' : 'English'}
            </button>
          </div>

          <button
            onClick={handleShuffleFonts}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] bg-gradient-to-r from-[#8b5cf6] to-[#f43f5e] hover:scale-105 active:scale-95 transition-all"
            id="fonts-shuffle-btn"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isRtl ? 'توليد توليفة جديدة' : 'Generate Pairings'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10">
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'hierarchy'
                ? 'bg-gradient-to-r from-[#8b5cf6] to-[#f43f5e] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المستويات الأربعة' : '4-Tier Hierarchy'}</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'presets'
                ? 'bg-gradient-to-r from-[#8b5cf6] to-[#f43f5e] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isRtl ? 'التوافقات الجاهزة' : 'Curated Presets'}</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'export'
                ? 'bg-gradient-to-r from-[#8b5cf6] to-[#f43f5e] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isRtl ? 'تصدير CSS' : 'Export CSS'}</span>
          </button>
        </div>

        {/* Mathematical Scale Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold hidden sm:inline">
            {isRtl ? 'المقياس الرياضي:' : 'Scale Ratio:'}
          </span>
          <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10">
            {scales.map(s => (
              <button
                key={s.ratio}
                onClick={() => applyScale(s.ratio, baseSize)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  scaleRatio === s.ratio ? 'bg-white text-[#0f0714] font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
                title={s.desc}
              >
                {s.ratio}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW 1: PRESETS VIEW */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_FONT_PAIRINGS.map(preset => (
            <div
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className="p-6 rounded-[28px] border border-white/10 bg-white/5 hover:border-[#8b5cf6] cursor-pointer transition-all space-y-4 shadow-xl hover:scale-[1.02] group"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#8b5cf6]/20 text-[#8b5cf6]">
                  {preset.category}
                </span>
                <span className="text-xs text-slate-400">{preset.languageSupport}</span>
              </div>

              <div>
                <h3 className="font-bold text-white group-hover:text-[#f43f5e] transition-colors">
                  {preset.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Display: <span className="text-white font-mono">{preset.display}</span> • Body: <span className="text-white font-mono">{preset.body}</span>
                </p>
              </div>

              {/* Mini preview */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <p className="font-bold text-lg text-white" style={{ fontFamily: preset.display }}>
                  العناوين الجريئة
                </p>
                <p className="text-xs text-slate-300 line-clamp-2" style={{ fontFamily: preset.body }}>
                  نصوص ومحتوى عالي المقروئية والتناغم البصري لتصميمك.
                </p>
              </div>

              <button className="w-full py-2 rounded-full text-xs font-bold bg-white/10 text-white group-hover:bg-[#8b5cf6] transition-all">
                {isRtl ? 'تطبيق هذا التوافق ←' : 'Apply Preset →'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: EXPORT CSS VIEW */}
      {activeTab === 'export' && (
        <div className="p-6 rounded-[28px] border border-white/10 bg-white/5 space-y-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              {isRtl ? 'كود CSS الجاهز للاستخدام' : 'Production CSS Typography Tokens'}
            </h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(getCssCode());
                showToast(isRtl ? 'تم نسخ كود الخطوط' : 'Copied typography CSS');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-[#8b5cf6] to-[#f43f5e] text-white hover:scale-105 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{isRtl ? 'نسخ كود CSS' : 'Copy CSS'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre leading-relaxed">
            {getCssCode()}
          </div>
        </div>
      )}

      {/* VIEW 3: MAIN 4 HIERARCHY TIERS */}
      {activeTab === 'hierarchy' && (
        <div className="space-y-6">
          {/* Live Text Customizer Bar */}
          <div className="p-5 rounded-[24px] border border-white/10 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full space-y-1">
              <label className="text-xs font-bold text-slate-400">
                {isRtl ? 'نص التجربة المخصص (عربي):' : 'Custom Arabic Preview Text:'}
              </label>
              <input
                type="text"
                value={customTesterTextAr}
                onChange={e => setCustomTesterTextAr(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#8b5cf6]"
              />
            </div>
            <div className="flex-1 w-full space-y-1">
              <label className="text-xs font-bold text-slate-400">
                {isRtl ? 'نص التجربة المخصص (إنجليزي):' : 'Custom English Preview Text:'}
              </label>
              <input
                type="text"
                value={customTesterTextEn}
                onChange={e => setCustomTesterTextEn(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#8b5cf6]"
              />
            </div>
          </div>

          {/* Cards for each level */}
          {levels.map(lvl => (
            <div
              key={lvl.role}
              className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-xl transition-all hover:border-[#8b5cf6]/50 text-right space-y-5"
              id={`font-level-card-${lvl.role}`}
            >
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30">
                    {isRtl ? lvl.roleNameAr : lvl.roleNameEn}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {lvl.fontSize} • {lvl.weight}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Select font */}
                  <select
                    value={lvl.fontName}
                    onChange={e => handleFontChange(lvl.role, e.target.value)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-black/40 border border-white/20 text-white focus:outline-none focus:border-[#8b5cf6]"
                  >
                    <optgroup label="Arabic Fonts">
                      {arabicFonts.map(f => (
                        <option key={f} value={f} className="bg-[#0f0714] text-white">
                          {f}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="English / Latin Fonts">
                      {englishFonts.map(f => (
                        <option key={f} value={f} className="bg-[#0f0714] text-white">
                          {f}
                        </option>
                      ))}
                    </optgroup>
                  </select>

                  <button
                    onClick={() => toggleLevelLock(lvl.role)}
                    className={`p-2 rounded-full border transition-all ${
                      lvl.locked
                        ? 'bg-[#f43f5e] border-[#f43f5e] text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                    title={lvl.locked ? 'Locked' : 'Lock'}
                  >
                    {lvl.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Visual Rendered Specimen */}
              <div className="space-y-3">
                <p
                  style={{ fontFamily: lvl.fontName, fontSize: lvl.fontSize, lineHeight: lvl.lineHeight }}
                  className="text-white font-bold transition-all"
                >
                  {customTesterTextAr || lvl.sampleTextAr}
                </p>
                <p
                  style={{ fontFamily: lvl.fontName, fontSize: `calc(${lvl.fontSize} * 0.85)`, lineHeight: lvl.lineHeight }}
                  className="text-slate-300 font-medium transition-all"
                  dir="ltr"
                >
                  {customTesterTextEn || lvl.sampleTextEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
