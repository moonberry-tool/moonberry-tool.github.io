import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MoonberryLogo } from '../common/MoonberryLogo';
import { 
  Palette, 
  Type, 
  Grid3X3, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Copy, 
  Check, 
  RefreshCw,
  Compass
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { language, openTool, showToast } = useApp();
  const isRtl = language === 'ar';

  // Interactive Mini-Demo State inside Hero
  const [demoColors, setDemoColors] = useState([
    { hex: '#0B0C1A', name: 'Navy Space' },
    { hex: '#3B0764', name: 'Royal Plum' },
    { hex: '#7B2CBF', name: 'Violet Star' },
    { hex: '#EC4899', name: 'Berry Neon' },
    { hex: '#FDE047', name: 'Crescent Sun' },
  ]);

  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const samplePalettes = [
    [
      { hex: '#0B0C1A', name: 'Navy Space' },
      { hex: '#3B0764', name: 'Royal Plum' },
      { hex: '#7B2CBF', name: 'Violet Star' },
      { hex: '#EC4899', name: 'Berry Neon' },
      { hex: '#FDE047', name: 'Crescent Sun' },
    ],
    [
      { hex: '#0F172A', name: 'Midnight' },
      { hex: '#6366F1', name: 'Electric' },
      { hex: '#A855F7', name: 'Purple Neon' },
      { hex: '#C084FC', name: 'Lilac' },
      { hex: '#FAF5FF', name: 'White Mist' },
    ],
    [
      { hex: '#1E1B4B', name: 'Deep Indigo' },
      { hex: '#4338CA', name: 'Cobalt' },
      { hex: '#8B5CF6', name: 'Lavender' },
      { hex: '#F43F5E', name: 'Rose Red' },
      { hex: '#FEF08A', name: 'Warm Cream' },
    ],
  ];

  const handleShuffleDemo = () => {
    const nextPalette = samplePalettes[Math.floor(Math.random() * samplePalettes.length)];
    setDemoColors(nextPalette);
  };

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(isRtl ? `تم نسخ الكود ${hex}` : `Copied ${hex}`);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <section 
      id="moonberry-hero-section"
      className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-white/10 dark:border-white/10 light:border-slate-200"
    >
      {/* Background Soft Atmospheric Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-[#f43f5e]/25 via-[#8b5cf6]/20 to-[#c026d3]/15 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          
          {/* Phase 4 Complete Brand Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-400 backdrop-blur-md mb-8 text-xs font-bold uppercase tracking-widest shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span>{isRtl ? '✓ المرحلة 4: منصة مونبيري مكتملة للإنتاج (Production Suite Ready)' : '✓ Phase 4: Production Suite Complete'}</span>
          </div>

          {/* Prominent Official Logo Graphic */}
          <div className="mb-6 relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] rounded-full blur-xl opacity-60 group-hover:opacity-100 transition duration-500" />
            <div className="relative">
              <MoonberryLogo size="xl" variant="icon" />
            </div>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter mb-4 leading-[1.1]">
            <span className="font-english text-white dark:text-white light:text-slate-900">
              Creative tools <br className="hidden sm:inline" />
              with a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f43f5e] via-[#c026d3] to-[#8b5cf6]">
                berry twist.
              </span>
            </span>
          </h1>

          {/* Tagline */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#f43f5e] mb-6 tracking-wide">
            {isRtl ? 'أدوات إبداعية استثنائية لمصممي الجرافيك' : 'Creative Tools for Graphic Designers'}
          </h2>

          {/* Short Narrative Description */}
          <p className="max-w-2xl text-base sm:text-lg text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed mb-8">
            {isRtl
              ? 'تجمع Moonberry الأدوات والمرافق الأساسية التي تحتاجها يومياً في مساحة عمل واحدة ذكية وسريعة: باليتات ألوان، توافق الخطوط، شبكات ومقاسات التصميم، ومكتبة برومبتات منتقاة بعناية.'
              : "Moonberry simplifies your creative workflow with an interface that feels like magic. We're currently building our core foundation."}
          </p>

          {/* Creators Avatars Waitlist row */}
          <div className="flex items-center gap-3 mb-10">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#0f0714] bg-gradient-to-tr from-[#f43f5e] to-[#8b5cf6] text-[10px] font-bold flex items-center justify-center text-white">MB</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#0f0714] bg-slate-700 text-[10px] font-bold flex items-center justify-center text-slate-300">UX</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#0f0714] bg-slate-600 text-[10px] font-bold flex items-center justify-center text-slate-300">AI</div>
            </div>
            <span className="text-xs text-slate-400">
              {isRtl ? 'انضم إلى مجتمع مصممي Moonberry' : 'Join 1,200+ creators on the waitlist'}
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
            <button
              onClick={() => openTool('colors')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-bold text-[#0f0714] bg-white shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all duration-200 hover:scale-105 active:scale-95"
              id="hero-primary-cta-button"
            >
              <span>{isRtl ? 'استكشف التطبيق المباشر' : 'Explore App'}</span>
              {isRtl ? <ArrowLeft className="w-5 h-5 text-[#f43f5e]" /> : <ArrowRight className="w-5 h-5 text-[#f43f5e]" />}
            </button>

            <button
              onClick={() => openTool('grid')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-full text-base font-semibold border transition-all duration-200 bg-white/5 border-white/10 text-slate-200 hover:border-[#f43f5e] hover:bg-white/10 dark:bg-white/5 dark:border-white/10 light:bg-white light:border-slate-300 light:text-slate-800"
              id="hero-secondary-preview-button"
            >
              <Compass className="w-5 h-5 text-[#38BDF8]" />
              <span>{isRtl ? 'تصفح المقاسات والشبكات' : 'Browse Safe Grids'}</span>
            </button>
          </div>

          {/* Interactive Live Palette Teaser Card (Real UI Showcase with Vibrant styling) */}
          <div className="relative w-full max-w-4xl">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] rounded-[40px] opacity-20 blur-2xl" />
            
            <div className="relative rounded-[32px] border border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900/50 dark:bg-slate-900/50 light:bg-white p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-right">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10 dark:border-white/10 light:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#f43f5e]/20 text-[#f43f5e]">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white dark:text-white light:text-slate-900">
                      {isRtl ? 'مولد الألوان التوافقي المباشر' : 'Live Harmonic Palette Generator'}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-500">
                      {isRtl ? 'انقر على أي كود لنسخه فوراً أو اضغط لتبديل الباليت' : 'Click any hex code to copy or regenerate'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShuffleDemo}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all bg-white/5 border-white/10 text-[#f43f5e] hover:bg-[#f43f5e]/15 hover:border-[#f43f5e]"
                    id="hero-shuffle-palette-button"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'توليد باليت جديد' : 'Shuffle Palette'}</span>
                  </button>
                </div>
              </div>

              {/* Visual Color Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-5">
                {demoColors.map((col, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCopyColor(col.hex)}
                    className="group relative flex flex-col justify-between p-4 h-32 sm:h-36 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg shadow-black/40"
                    style={{ backgroundColor: col.hex }}
                    id={`hero-demo-color-${idx}`}
                  >
                    <div className="flex justify-between items-start">
                      <span 
                        className="px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider backdrop-blur-md"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          color: '#FFFFFF'
                        }}
                      >
                        {col.name}
                      </span>
                      <button
                        className="p-1 rounded-md bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Copy hex code"
                      >
                        {copiedHex === col.hex ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-white drop-shadow-md">
                      <span className="font-english font-bold text-sm tracking-wider">
                        {col.hex}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
